import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { Column, Entity } from 'typeorm';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';

@Entity()
export class PortalUserIdentificationVerification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: UserIdentifierType,
  })
  identifierType: UserIdentifierType;

  @Column()
  identifier: string;

  verificationCode: string;

  @Column({
    type: 'text',
  })
  verificationCodeHash: string;

  @Column({
    type: 'timestamp',
  })
  expiresOn: Date;

  usedOn: Date;
  deactivatedOn: Date;
}