import { Column, Entity } from 'typeorm';
import { Gender } from '../constants/gender.constant';
import { BaseEntity } from '@tss/common';

@Entity()
export class PortalUser extends BaseEntity {
  @Column({
    nullable: true,
  })
  password: string;
  @Column({
    default: false,
  })
  passwordUpdateRequired: boolean;
  @Column({
    type: 'timestamp',
    nullable: true,
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
    nullable: true
  })
  gender: Gender;
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  publishedOn?: Date;
}
