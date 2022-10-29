import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@dlabs/common';

@Entity()
export class Setting extends BaseEntity {
  @Column()
  label: string;

  @Column()
  value: string;
}
