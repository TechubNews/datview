import { PartialType } from '@nestjs/mapped-types';
import { CreateHoldingDto } from './create-holding.dto';

// 用于更新持仓记录时的数据验证对象，所有字段都是可选的
export class UpdateHoldingDto extends PartialType(CreateHoldingDto) {}
