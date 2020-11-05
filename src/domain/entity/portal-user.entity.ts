import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../tss-common/data-utils/base.entity';
import { Gender } from '../constants/gender.constant';

@Entity()
export class PortalUser extends BaseEntity {
  @Column()
  password: string;
  @Column()
  passwordUpdateRequired: boolean;
  @Column({
    type: 'timestamp',
  })
  passwordLastUpdatedOn: Date;
  @Column()
  displayName: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({
    nullable: true,
  })
  otherName?: string;
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  publishedOn?: Date;
}