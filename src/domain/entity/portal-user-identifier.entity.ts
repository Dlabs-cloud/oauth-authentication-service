import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';
import { PortalUser } from './portal-user.entity';
import { PortalUserIdentificationVerification } from './portal-user-identification-verification.entity';
import { BaseEntity } from '@dlabs/common';

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

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dateVerified: Date;


  @ManyToOne(() => PortalUser, {
    eager: true,
  })
  portalUser: PortalUser;

  @OneToOne(() => PortalUserIdentificationVerification)
  verification: PortalUserIdentificationVerification;
}
