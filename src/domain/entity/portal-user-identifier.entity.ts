import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';
import { PortalUser } from './portal-user.entity';
import { PortalUserIdentificationVerification } from './portal-user-identification-verification.entity';

@Entity()
export class PortalUserIdentifier extends BaseEntity {

  @Column({
    type: 'enum',
    enum: UserIdentifierType,
  })
  identifierType: UserIdentifierType;

  @Column({
    unique: true,
  })
  identifier: string;

  verified: boolean;

  dateVerified: Date;


  @ManyToOne(() => PortalUser)
  portalUser: PortalUser;

  @OneToOne(() => PortalUserIdentificationVerification)
  verification: PortalUserIdentificationVerification;
}