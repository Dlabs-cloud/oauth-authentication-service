import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@dlabs/common';

@Entity()
export class Client extends BaseEntity {

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;



}
