import { BaseEntity } from '@tss/common/utils/typeorm/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { JwtType } from '../constants/jwt-type.constant';


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