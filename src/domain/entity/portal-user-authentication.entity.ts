import { BaseEntity } from '@tss/common/utils/typeorm/base.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AuthenticationResponseType } from '../constants/authentication-response-type,constant';
import { AuthenticationType } from '../constants/authentication-type.constant';
import { PortalUser } from './portal-user.entity';
import { PortalUserIdentifier } from './portal-user-identifier.entity';
import { PasswordResetRequest } from './password-reset-request.entity';
import { IllegalArgumentException } from '@tss/common/exceptions/illegal-argument.exception';

@Entity()
export class PortalUserAuthentication extends BaseEntity {
  @Column()
  identifier: string;

  @Column({
    type: 'enum',
    enum: AuthenticationResponseType,
  })
  responseType: AuthenticationResponseType;


  @Column({
    type: 'enum',
    enum: AuthenticationType,
  })
  type: AuthenticationType;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @ManyToOne(() => PortalUserIdentifier)
  portalUserIdentifier: PortalUserIdentifier;

  @ManyToOne(() => PortalUser, {
    eager: true,
  })
  portalUser: PortalUser;

  @OneToOne(() => PasswordResetRequest)
  @JoinColumn()
  passwordResetRequest: PasswordResetRequest;

  lastActiveAt: Date;

  becomesInactiveAt: Date;

  autoLogoutAt: Date;

  loggedOutAt: Date;


  deactivatedAt: Date;

  @BeforeInsert()
  beforeInsert() {

    if (!this.portalUser) {
      this.portalUser = this.portalUserIdentifier.portalUser;
    } else {
      if (this.portalUser.id != this.portalUserIdentifier.portalUser.id) {
        throw new IllegalArgumentException();
      }
    }

  }
}

