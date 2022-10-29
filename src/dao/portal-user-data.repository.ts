import { BaseRepository } from '@dlabs/common';
import { PortalUserData } from '../domain/entity/portal-user-data.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(PortalUserData)
export class PortalUserDataRepository extends BaseRepository<PortalUserData> {

}