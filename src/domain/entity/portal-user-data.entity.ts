
import { Column, Entity, ManyToOne } from 'typeorm';
import { PortalUser } from './portal-user.entity';
import { BaseEntity } from '@dlabs/common';

@Entity()
export class PortalUserData extends BaseEntity {

  @ManyToOne(() => PortalUser)
  portalUser: PortalUser;
  @Column()
  name: string;
  @Column()
  value: string;
}
