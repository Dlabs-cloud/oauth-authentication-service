import { BaseEntity } from '@tss/common/utils/typeorm/base.entity';
import { Column, Entity } from 'typeorm';
import { JwtType } from '../constants/jwt-type.constant';


@Entity()
export class SignatureKey extends BaseEntity {

  keyId: string;


  @Column({
    type: 'text',
  })
  encodedKey: string;

  algorithm: string;

  format: string;

  type: JwtType;
}