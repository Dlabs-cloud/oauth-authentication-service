import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { PasswordResetApiRequest } from '../data/request/password-reset-api.request';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';

export interface PasswordUpdateService {
  updatePassword(passwordResetRequest: PasswordResetRequest, passwordResetApiRequest: PasswordResetApiRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>;
}

export const PasswordUpdateService = Symbol('PasswordUpdateService');