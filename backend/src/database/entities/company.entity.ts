import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Holding } from './holding.entity';

@Entity('companies')
export class Company {
  // 唯一标识符 (主键)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 公司或实体全名
  @Column({ type: 'text', nullable: false })
  name: string;

  // 股票代码
  @Column({ type: 'text', nullable: true })
  ticker: string;

  // 类别 (例如: Public Company, Private Company, ETF)
  @Column({ type: 'text', nullable: true })
  category: string;

  // 所属行业
  @Column({ type: 'text', nullable: true })
  sector: string;

  // 所在国家/地区
  @Column({ type: 'text', nullable: true })
  country: string;

  // 官方网站链接
  @Column({ type: 'text', nullable: true })
  website_url: string;

  // 公司Logo图片的URL
  @Column({ type: 'text', nullable: true })
  logo_url: string;

  // 公司简介或其持仓策略的简要描述
  @Column({ type: 'text', nullable: true })
  description: string;

  // 记录创建时间
  @CreateDateColumn()
  created_at: Date;

  // 记录更新时间
  @UpdateDateColumn()
  updated_at: Date;

  // 一对多关系：一个公司可以有多个持仓记录
  @OneToMany(() => Holding, (holding) => holding.company)
  holdings: Holding[];
}
