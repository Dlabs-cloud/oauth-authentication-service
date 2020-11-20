import { PortalUser } from '../domain/entity/portal-user.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { EntityManager } from 'typeorm';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';

export interface ImplicitAuthenticationService {
  createSignUpAuthentication(entityManager: EntityManager,
                             portalUser: PortalUser,
                             requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>

  createPasswordResetAuthentication(entityManager: EntityManager,
                                    passwordResetRequest: PasswordResetRequest,
                                    requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>

}

export const ImplicitAuthenticationService = Symbol('ImplicitAuthenticationService');