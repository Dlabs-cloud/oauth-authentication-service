import { BaseRepository } from '@dlabs/common';
import { PortalUser } from '../domain/entity/portal-user.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(PortalUser)
export class PortalUserRepository extends BaseRepository<PortalUser> {

}