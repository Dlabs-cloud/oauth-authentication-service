import { BaseRepository } from '@tss/common';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(PortalUserAuthentication)
export class PortalUserAuthenticationRepository extends BaseRepository<PortalUserAuthentication> {

}