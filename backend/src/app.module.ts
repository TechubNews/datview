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
import { CompaniesModule } from './companies/companies.module';
import { AssetsModule } from './assets/assets.module'; // <-- 新增导入
import { HoldingsModule } from './holdings/holdings.module'; // <-- 新增导入

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
          entities: [User, Company, Asset, Holding],
          synchronize: true, 
        };
      },
    }),
    AuthModule,
    CompaniesModule,
    AssetsModule, // <-- 新增注册
    HoldingsModule, // <-- 新增注册
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

