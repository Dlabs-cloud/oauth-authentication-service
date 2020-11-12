import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';

export interface PortalUserRegistrationService {
  register(userData: UserRegistrationApiRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>;
}

export const PortalUserRegistrationService = Symbol('PortalUserRegistrationService');