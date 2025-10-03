import { IsNotEmpty, IsString, IsUUID, IsNumber, IsDateString, IsOptional } from 'class-validator';

// 用于创建新持仓记录时的数据验证对象
export class CreateHoldingDto {
  @IsUUID()
  @IsNotEmpty()
  company_id: string; // 关联的公司ID

  @IsUUID()
  @IsNotEmpty()
  asset_id: string; // 关联的资产ID

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // 持有数量

  @IsNumber()
  @IsOptional()
  avg_cost_basis_usd?: number; // 平均买入成本 (美元)

  @IsDateString()
  @IsOptional()
  first_purchase_date?: Date; // 首次购买日期
}
