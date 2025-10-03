import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

/**
 * 更新公司时使用的数据传输对象 (DTO)
 */
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

