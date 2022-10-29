import { BaseRepository } from '@dlabs/common';
import { RefreshToken } from '../domain/entity/refresh-token.entity';
import { EntityRepository } from 'typeorm';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  findActive(id: number) {
    return this.createQueryBuilder('refreshToken')
      .select()
      .innerJoin(PortalUserAuthentication, 'portalUserAuthentication', 'portalUserAuthentication.id = refreshToken.portalUserAuthenticationId')
      .where('refreshToken.id = :id')
      .andWhere('refreshToken.timeDeactivated IS NULL')
      .andWhere('refreshToken.expiresAt >= CURRENT_TIMESTAMP')
      .andWhere('portalUserAuthentication.loggedOutAt IS NULL')
      .andWhere('portalUserAuthentication.deactivatedAt IS NULL')
      .andWhere('portalUserAuthentication.autoLogoutAt > CURRENT_TIMESTAMP ')
      .setParameter('id', id)
      .getOne();
  }
}