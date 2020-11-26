import { LoginAuthenticationService } from '../service/login-authentication.service';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { LoginRequest } from '../data/request/login.request';
import { Connection } from 'typeorm';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { AuthenticationResponseType } from '../domain/constants/authentication-response-type,constant';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { AuthenticationType } from '../domain/constants/authentication-type.constant';
import { Injectable } from '@nestjs/common';
import { HashService } from '@tss/common';

@Injectable()
export class LoginAuthenticationServiceImpl implements LoginAuthenticationService {
  constructor(private readonly connection: Connection,
              private readonly hashService: HashService) {
  }

  async getAuthenticationResponse(loginRequest: LoginRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication> {
    let portalUserIdentifier = await this.connection.getCustomRepository(PortalUserIdentifierRepository).findByIdentifier(loginRequest.identifier.toLowerCase());
    if (!portalUserIdentifier) {
      return this.createUnknownAccountResponse(loginRequest, requestMetaData);
    }
    const isPasswordValid = await this.hashService.compare(loginRequest.password, portalUserIdentifier.portalUser.password);
    if (!isPasswordValid) {
      return this.createInValidCredentialsResponse(loginRequest, requestMetaData);
    }

    return this.createSuccessfulResponse(portalUserIdentifier, loginRequest, requestMetaData);
  }


  createSuccessfulResponse(portalUserIdentifier: PortalUserIdentifier, loginRequest: LoginRequest, requestMetaData: RequestMetaData) {
    let portalUserAuthentication = this.makeAuthenticationResponse(loginRequest, requestMetaData, AuthenticationResponseType.SUCCESSFUL);
    portalUserAuthentication.portalUserIdentifier = portalUserIdentifier;
    return portalUserAuthentication.save();
  }

  createInValidCredentialsResponse(loginRequest: LoginRequest, requestMetaData: RequestMetaData) {
    let portalUserAuthentication = this.makeAuthenticationResponse(loginRequest, requestMetaData, AuthenticationResponseType.INCORRECT_CREDENTIAL);
    return portalUserAuthentication.save();
  }

  createUnknownAccountResponse(loginRequest: LoginRequest, requestMetaData: RequestMetaData) {
    let portalUserAuthentication = this.makeAuthenticationResponse(loginRequest, requestMetaData, AuthenticationResponseType.UNKNOWN_ACCOUNT);
    return portalUserAuthentication.save();
  }

  makeAuthenticationResponse(loginRequest: LoginRequest, requestMetaData: RequestMetaData, authenticationResponseType: AuthenticationResponseType) {
    let portalUserAuthentication = new PortalUserAuthentication();
    portalUserAuthentication.identifier = loginRequest.identifier.toLowerCase();
    portalUserAuthentication.responseType = authenticationResponseType;
    portalUserAuthentication.ipAddress = requestMetaData.ipAddress;
    portalUserAuthentication.type = AuthenticationType.LOGIN;
    portalUserAuthentication.userAgent = requestMetaData.userAgent;
    return portalUserAuthentication;


  }

}