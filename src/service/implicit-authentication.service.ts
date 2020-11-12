import { PortalUser } from '../domain/entity/portal-user.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { EntityManager } from 'typeorm';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';

export interface ImplicitAuthenticationService {
  createSignUpAuthentication(entityManager: EntityManager,
                             portalUser: PortalUser,
                             requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>
}

export const ImplicitAuthenticationService = Symbol('ImplicitAuthenticationService');