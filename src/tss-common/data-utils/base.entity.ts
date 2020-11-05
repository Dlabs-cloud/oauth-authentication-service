import {
  BaseEntity as TypeOrmBaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenericStatus } from '../../domain/constants/generic-status.constant';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: GenericStatus,
    default: GenericStatus.ACTIVE,

  })
  status?: GenericStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt?: Date;
}