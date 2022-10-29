import { Column, Entity, ManyToOne } from 'typeorm';
import { Client } from './client.entity';
import { BaseEntity } from '@dlabs/common';

@Entity()
export class ClientCredential extends BaseEntity {

  @ManyToOne(() => Client)
  client: Client;

  @Column({ unique: true })
  identifier: string;

  @Column()
  secret: string;
}
