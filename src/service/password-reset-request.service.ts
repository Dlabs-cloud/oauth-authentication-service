import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';

export interface PasswordResetRequestService {
  createRequest(portalUserIdentifier: PortalUserIdentifier, requestMetaData: RequestMetaData): Promise<PasswordResetRequest>;
}

export const PasswordResetRequestService = Symbol('PasswordResetRequestService');