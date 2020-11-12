import { BaseEntity } from '@tss/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @Column()
  label: string;

  @Column()
  value: string;
}