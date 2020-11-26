import { PasswordUpdateService } from '../service/password-update.service';
import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { PasswordResetApiRequest } from '../data/request/password-reset-api.request';
import { Connection, EntityManager } from 'typeorm';
import { PortalUser } from '../domain/entity/portal-user.entity';

import { PortalUserAuthenticationRepository } from '../dao/portal-user-authentication.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ImplicitAuthenticationService } from '../service/implicit-authentication.service';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { HashService } from '@tss/common';

@Injectable()
export class PasswordUpdateServiceImpl implements PasswordUpdateService {
  constructor(private readonly hashService: HashService,
              @Inject(ImplicitAuthenticationService) private readonly implicitAuthenticationService: ImplicitAuthenticationService,
              private readonly connection: Connection) {
  }

  updatePassword(passwordResetRequest: PasswordResetRequest, passwordResetApiRequest: PasswordResetApiRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication> {
    let currentDate = new Date();

    return this.connection.transaction(async entityManager => {
      let portalUser = passwordResetRequest.portalUser;
      portalUser.passwordLastUpdatedOn = currentDate;
      portalUser.password = await this.hashService.hash(passwordResetApiRequest.password);
      portalUser.passwordUpdateRequired = false;
      await entityManager.save(portalUser);
      passwordResetRequest.usedOn = currentDate;
      await entityManager.save(passwordResetRequest);
      if (passwordResetApiRequest.invalidateOtherSession) {
        await this.deactivateActivePortalUserAuthSession(entityManager, portalUser);
      }
      return this.implicitAuthenticationService.createPasswordResetAuthentication(entityManager, passwordResetRequest, requestMetaData);
    });


  }

  private deactivateActivePortalUserAuthSession(entityManager: EntityManager, portalUser: PortalUser) {
    const auths = this.connection.getCustomRepository(PortalUserAuthenticationRepository)
      .findAllSuccessfulSessions(portalUser)
      .then(portalUserAuths => {
        portalUserAuths.map(portalUserAuth => {
          portalUserAuth.deactivatedAt = new Date();
          return entityManager.save(portalUserAuth);
        });
      });
    return Promise.resolve(auths);
  }

}