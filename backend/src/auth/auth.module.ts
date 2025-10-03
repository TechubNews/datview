import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 导入 User 实体，使其可以在 AuthService 中被注入
    PassportModule,
    JwtModule.register({}), // 注册 JWT 模块，具体配置在 Service 中动态提供
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
