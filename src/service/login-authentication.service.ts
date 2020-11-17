import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { LoginRequest } from '../data/request/login.request';
import { RequestMetaData } from '../security/data/request-meta-data.dto';

export interface LoginAuthenticationService {
  getAuthenticationResponse(loginRequest: LoginRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication>;
}


export const LoginAuthenticationService = Symbol('LoginAuthenticationService');