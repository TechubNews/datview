import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Holding } from './holding.entity';

@Entity('assets')
export class Asset {
  // 唯一标识符 (主键)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 加密货币名称
  @Column({ type: 'text', unique: true, nullable: false })
  name: string;

  // 资产代码
  @Column({ type: 'text', unique: true, nullable: false })
  symbol: string;

  // 货币Logo的URL
  @Column({ type: 'text', nullable: true })
  logo_url: string;

  // 一对多关系：一个资产可以被多个持仓记录引用
  @OneToMany(() => Holding, (holding) => holding.asset)
  holdings: Holding[];
}
