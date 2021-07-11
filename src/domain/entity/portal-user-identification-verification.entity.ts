
import { Column, Entity } from 'typeorm';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';
import { BaseEntity } from '@tss/common';

@Entity()
export class PortalUserIdentificationVerification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: UserIdentifierType,
  })
  identifierType: UserIdentifierType;

  @Column()
  identifier: string;


  @Column({
    nullable: true,
  })
  verificationCode: string;

  @Column({
    type: 'text',
  })
  verificationCodeHash: string;

  @Column({
    type: 'timestamp',
  })
  expiresOn: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  usedOn: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deactivatedOn: Date;
}
