import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';

export interface PortalUserRegistrationService {
  register(userData: UserRegistrationApiRequest);
}

export const PortalUserRegistrationService = Symbol('PortalUserRegistrationService');