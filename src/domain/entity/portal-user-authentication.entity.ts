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
  @Column({
    nullable: true,
  })
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

  @ManyToOne(() => PortalUserIdentifier, {
    nullable: true,
  })

  portalUserIdentifier: PortalUserIdentifier;

  @ManyToOne(() => PortalUser, {
    eager: true,
  })
  portalUser: PortalUser;

  @OneToOne(() => PasswordResetRequest)
  @JoinColumn()
  passwordResetRequest: PasswordResetRequest;

  @Column({
    nullable: true,
  })
  lastActiveAt: Date;

  @Column({
    nullable: true,
  })
  becomesInactiveAt: Date;

  @Column({
    nullable: true,
  })
  autoLogoutAt: Date;


  @Column({
    nullable: true,
  })
  loggedOutAt: Date;

  @Column({
    nullable: true,
  })
  deactivatedAt: Date;

  @BeforeInsert()
  private beforeInsert() {

    if (!this.portalUser) {
      this.portalUser = this.portalUserIdentifier.portalUser;
    } else {
      if (this.portalUserIdentifier && (this.portalUser.id != this.portalUserIdentifier.portalUser.id)) {
        throw new IllegalArgumentException();
      }
    }

  }
}

