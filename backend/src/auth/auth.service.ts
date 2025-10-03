import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 处理用户注册
   * @param registerDto 注册数据传输对象
   * @returns 创建的用户对象（不含密码）
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('此邮箱已被注册');
    }
    const hashedPassword = await argon2.hash(registerDto.password);
    const user = this.usersRepository.create({
      email: registerDto.email,
      password_hash: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    
    // 修复：使用解构赋值来安全地移除 password_hash，而不是使用 delete
    const { password_hash, ...result } = savedUser;
    return result;
  }

  /**
   * 处理用户登录
   * @param loginDto 登录数据传输对象
   * @returns 包含 Access Token 和 Refresh Token 的对象
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password_hash'],
    });
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const isPasswordMatching = await argon2.verify(
      user.password_hash,
      loginDto.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const payload = { sub: user.id, email: user.email };
    return this.generateTokens(payload);
  }

  /**
   * 刷新用户的 Access Token
   * @param oldRefreshToken 用户持有的旧的 Refresh Token
   * @returns 新的 Access Token 和 Refresh Token
   */
  async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('未提供刷新令牌');
    }
    try {
      // 验证 Refresh Token, 从中解析出用户信息
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // 验证用户是否存在于数据库中
      const user = await this.usersRepository.findOneBy({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 用户有效，生成新的 Tokens
      const newPayload = { sub: user.id, email: user.email };
      return this.generateTokens(newPayload);
    } catch (error) {
      // 如果 verifyAsync 失败 (例如 token 过期或无效)，则抛出异常
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }

  /**
   * 生成 Access Token 和 Refresh Token
   * @param payload JWT 的载荷
   * @returns 包含 accessToken 和 refreshToken 的对象
   */
  private async generateTokens(payload: { sub: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

