import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';

// 用于更新资产时的数据验证对象，所有字段都是可选的
export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
