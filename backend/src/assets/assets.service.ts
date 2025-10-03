import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../database/entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  // 创建一个新资产
  create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetsRepository.create(createAssetDto);
    return this.assetsRepository.save(asset);
  }

  // 查找所有资产
  findAll(): Promise<Asset[]> {
    return this.assetsRepository.find();
  }

  // 根据ID查找单个资产
  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOneBy({ id });
    if (!asset) {
      throw new NotFoundException(`未找到ID为 "${id}" 的资产`);
    }
    return asset;
  }

  // 根据ID更新一个资产
  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.assetsRepository.preload({
      id,
      ...updateAssetDto,
    });
    if (!asset) {
      throw new NotFoundException(`未找到ID为 "${id}" 的资产`);
    }
    return this.assetsRepository.save(asset);
  }

  // 根据ID删除一个资产
  async remove(id: string): Promise<void> {
    const result = await this.assetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`未找到ID为 "${id}" 的资产`);
    }
  }
}
