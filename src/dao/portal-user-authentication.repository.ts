import { BaseRepository } from '@dlabs/common';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { EntityRepository } from 'typeorm';
import { PortalUser } from '../domain/entity/portal-user.entity';
import { AuthenticationResponseType } from '../domain/constants/authentication-response-type,constant';

@EntityRepository(PortalUserAuthentication)
export class PortalUserAuthenticationRepository extends BaseRepository<PortalUserAuthentication> {

  findAllSuccessfulSessions(portalUser: PortalUser) {
    return this.createQueryBuilder('portalUserAuthentication')
      .select()
      .where('portalUserAuthentication.responseType = :responseType', {
        responseType: AuthenticationResponseType.SUCCESSFUL,
      })
      .andWhere('portalUserAuthentication.deactivatedAt IS NULL')
      .andWhere('portalUserAuthentication.loggedOutAt IS NULL')
      .andWhere('portalUserAuthentication.loggedOutAt IS NULL OR portalUserAuthentication.loggedOutAt > CURRENT_TIMESTAMP')
      .andWhere('portalUserAuthentication.portalUserId = :userId')
      .setParameter('userId', portalUser.id)
      .getMany();
  }
}