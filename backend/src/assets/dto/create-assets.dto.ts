import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

// 用于创建新资产时的数据验证对象
export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string; // 资产名称，例如 "Bitcoin"

  @IsString()
  @IsNotEmpty()
  symbol: string; // 资产符号，例如 "BTC"

  @IsUrl()
  @IsNotEmpty()
  logo_url: string; // 资产Logo的URL
}
