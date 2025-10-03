import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Asset } from './asset.entity';

@Entity('holdings')
export class Holding {
  // 唯一标识符 (主键)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 持有数量
  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: false })
  quantity: number;

  // 平均买入成本 (美元)
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  avg_cost_basis_usd: number;

  // 首次购买日期
  @Column({ type: 'date', nullable: true })
  first_purchase_date: Date;

  // 多对一关系：多个持仓记录可以属于一个公司
  @ManyToOne(() => Company, (company) => company.holdings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' }) // 外键
  company: Company;

  // 多对一关系：多个持仓记录可以引用同一个资产
  @ManyToOne(() => Asset, (asset) => asset.holdings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' }) // 外键
  asset: Asset;
}
