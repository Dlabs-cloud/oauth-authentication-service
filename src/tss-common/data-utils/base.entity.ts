import {
  BaseEntity as TypeOrmBaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenericStatusConstant } from '../../domain/constants/generic-status.constant';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: GenericStatusConstant,
    default: GenericStatusConstant.ACTIVE,

  })
  status?: GenericStatusConstant;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt?: Date;
}