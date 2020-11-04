import { Column, Entity } from 'typeorm';
import { GenderConstant } from '../constants/gender.constant';
import { BaseEntity } from '../../tss-common/data-utils/base.entity';

@Entity()
export class PortalUserEntity extends BaseEntity {
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
    enum: GenderConstant,
  })
  gender: GenderConstant;
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  publishedO?: Date;
}