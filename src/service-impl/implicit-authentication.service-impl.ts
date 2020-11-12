import { ImplicitAuthenticationService } from '../service/implicit-authentication.service';
import { PortalUser } from '../domain/entity/portal-user.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { AuthenticationType } from '../domain/constants/authentication-type.constant';
import { AuthenticationResponseType } from '../domain/constants/authentication-response-type,constant';

@Injectable()
export class ImplicitAuthenticationServiceImpl implements ImplicitAuthenticationService {


  createSignUpAuthentication(entityManager: EntityManager,
                             portalUser: PortalUser,
                             requestMetaData: RequestMetaData): Promise<PortalUserAuthentication> {
    let portalUserAuthentication = new PortalUserAuthentication();
    portalUserAuthentication.portalUser = portalUser;
    portalUserAuthentication.type = AuthenticationType.USER_REGISTRATION;
    portalUserAuthentication.responseType = AuthenticationResponseType.SUCCESSFUL;
    portalUserAuthentication.ipAddress = requestMetaData.ipAddress;
    portalUserAuthentication.userAgent = requestMetaData.userAgent;
    return entityManager.save(portalUserAuthentication);
  }

}