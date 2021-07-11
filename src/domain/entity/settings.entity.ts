import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@tss/common';

@Entity()
export class Setting extends BaseEntity {
  @Column()
  label: string;

  @Column()
  value: string;
}
