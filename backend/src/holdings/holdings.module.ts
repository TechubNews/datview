import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoldingsService } from './holdings.service';
import { HoldingsController } from './holdings.controller';
import { Holding } from '../database/entities/holding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holding])],
  controllers: [HoldingsController],
  providers: [HoldingsService],
})
export class HoldingsModule {}
