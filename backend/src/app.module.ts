import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Company } from './database/entities/company.entity';
import { Asset } from './database/entities/asset.entity';
import { Holding } from './database/entities/holding.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isSupabase = !!configService.get('DATABASE_URL');
        return {
          type: 'postgres',
          ...(isSupabase
            ? { url: configService.get('DATABASE_URL'), ssl: { rejectUnauthorized: false } }
            : {
                host: configService.get<string>('DATABASE_HOST'),
                port: parseInt(configService.get<string>('DATABASE_PORT', '5432')),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
              }),
          // 关键改动：告知 TypeORM 所有实体文件的位置
          entities: [User, Company, Asset, Holding],
          synchronize: true, // 在开发环境中自动同步数据库表结构
        };
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

