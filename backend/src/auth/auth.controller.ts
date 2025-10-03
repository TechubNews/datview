import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
// 修复：将 express 的类型导入改为 'import type'，以解决 TS1272 错误
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册端点
   * @param registerDto 包含用户邮箱和密码的请求体
   * @returns 返回创建的用户信息（不含密码）
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // 注册成功返回 201 Created
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录端点
   * 使用速率限制，每分钟最多10次请求
   * @param loginDto 包含用户邮箱和密码的请求体
   * @param response Express 的响应对象，用于设置 Cookie
   * @returns 返回包含 access_token 的对象
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 1分钟内最多10次请求
  @Post('login')
  @HttpCode(HttpStatus.OK) // 登录成功返回 200 OK
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 调用 AuthService 处理登录逻辑
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    // 将 Refresh Token 存储在 HttpOnly Cookie 中
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    return { access_token: accessToken };
  }

  /**
   * 用户登出端点
   * @param response Express 的响应对象，用于清除 Cookie
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    // 清除 refresh_token cookie
    response.clearCookie('refresh_token');
    return { message: '登出成功' };
  }

  /**
   * 刷新 Access Token 端点
   * @param request Express 的请求对象，用于从 Cookie 中获取 Refresh Token
   * @param response Express 的响应对象，用于设置新的 Cookie
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oldRefreshToken = request.cookies['refresh_token'];
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(oldRefreshToken);

    // 设置新的 refresh_token cookie
    response.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    return { access_token: accessToken };
  }
}

