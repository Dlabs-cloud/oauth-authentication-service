import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@tss/common';

@Entity()
export class Client extends BaseEntity {

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;



}
