import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // 主键，UUID 格式
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 邮箱列，唯一且不为空
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  // 密码哈希列，不为空，并且在常规查询中不会被选中返回，以增强安全性
  @Column({ type: 'varchar', nullable: false, select: false })
  password_hash: string;

  // 记录创建时间
  @CreateDateColumn()
  created_at: Date;

  // 记录最后更新时间
  @UpdateDateColumn()
  updated_at: Date;
}

