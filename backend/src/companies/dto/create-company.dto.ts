import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * 创建公司时使用的数据传输对象 (DTO)
 */
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  ticker?: string;

  @IsString()
  @IsNotEmpty()
  category: string;
  
  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsUrl()
  @IsOptional()
  website_url?: string;
  
  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

