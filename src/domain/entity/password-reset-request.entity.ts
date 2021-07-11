import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { PortalUserIdentifier } from './portal-user-identifier.entity';
import { PortalUser } from './portal-user.entity';
import { BaseEntity, IllegalArgumentException } from '@tss/common';

;

@Entity()
export class PasswordResetRequest extends BaseEntity {


  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @ManyToOne(() => PortalUserIdentifier, {
    eager: true,
  })
  portalUserIdentifier: PortalUserIdentifier;

  @ManyToOne(() => PortalUser, {
    eager: true,
  })
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
    nullable: true,
  })
  usedOn: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
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
