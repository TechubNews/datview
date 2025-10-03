import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holding } from '../database/entities/holding.entity';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';

@Injectable()
export class HoldingsService {
  constructor(
    @InjectRepository(Holding)
    private holdingsRepository: Repository<Holding>,
  ) {}

  // 创建一条新持仓记录
  create(createHoldingDto: CreateHoldingDto): Promise<Holding> {
    const holding = this.holdingsRepository.create(createHoldingDto);
    return this.holdingsRepository.save(holding);
  }

  // 查找所有持仓记录
  findAll(): Promise<Holding[]> {
    return this.holdingsRepository.find({ relations: ['company', 'asset'] }); // 同时加载关联的公司和资产信息
  }

  // 根据ID查找单条持仓记录
  async findOne(id: string): Promise<Holding> {
    const holding = await this.holdingsRepository.findOne({ 
      where: { id },
      relations: ['company', 'asset'],
    });
    if (!holding) {
      throw new NotFoundException(`未找到ID为 "${id}" 的持仓记录`);
    }
    return holding;
  }

  // 根据ID更新一条持仓记录
  async update(id: string, updateHoldingDto: UpdateHoldingDto): Promise<Holding> {
    const holding = await this.holdingsRepository.preload({
      id,
      ...updateHoldingDto,
    });
    if (!holding) {
      throw new NotFoundException(`未找到ID为 "${id}" 的持仓记录`);
    }
    return this.holdingsRepository.save(holding);
  }

  // 根据ID删除一条持仓记录
  async remove(id: string): Promise<void> {
    const result = await this.holdingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`未找到ID为 "${id}" 的持仓记录`);
    }
  }
}
