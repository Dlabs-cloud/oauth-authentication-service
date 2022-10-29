import { BeforeInsert, Column, Entity } from 'typeorm';
import { JwtType } from '../constants/jwt-type.constant';
import { BaseEntity } from '@dlabs/common';


@Entity()
export class SignatureKey extends BaseEntity {


  @Column({
    type: 'text',
  })
  keyId: string;

  publicKey: string;

  @Column({
    type: 'text',
  })
  encodedKey: string;

  @Column()
  algorithm: string;

  @Column()
  format: string;

  @Column({
    type: 'enum',
    enum: JwtType,
  })
  type: JwtType;


  @BeforeInsert()
  beforeInsert() {
    this.encodedKey = Buffer.from(this.publicKey).toString('base64');
  }

}
