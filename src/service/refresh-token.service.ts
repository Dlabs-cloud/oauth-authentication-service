import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { RefreshToken } from '../domain/entity/refresh-token.entity';
import { EntityManager } from 'typeorm';

export interface RefreshTokenService {
  createRefreshToken(entityManager: EntityManager, portalUserAuthentication: PortalUserAuthentication): Promise<RefreshToken>;

  deactivateRefreshToken(refreshToken: RefreshToken);
}


export const RefreshTokenService = Symbol('RefreshTokenService');
