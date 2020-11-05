import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { PortalUserIdentifier } from './portal-user-identifier.entity';
import { PortalUser } from './portal-user.entity';
import { IllegalArgumentException } from '../../exceptions/illegal-argument.exception';

@Entity()
export class PasswordResetRequest extends BaseEntity {


  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @ManyToOne(() => PortalUserIdentifier)
  portalUserIdentifier: PortalUserIdentifier;

  @ManyToOne(() => PortalUser)
  portalUser: PortalUser;

  @Column()
  resetCode: string;

  @Column()
  resetCodeHash: string;

  @Column({
    type: 'timestamp',
  })
  expiresOn: Date;

  @Column({
    type: 'timestamp',
  })
  usedOn: Date;

  @Column({
    type: 'timestamp',
  })
  deactivatedOn: Date;

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