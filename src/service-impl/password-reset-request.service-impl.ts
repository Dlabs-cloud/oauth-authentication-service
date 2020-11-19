import { PasswordResetRequestService } from '../service/password-reset-request.service';
import { Injectable } from '@nestjs/common';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { Connection, EntityManager } from 'typeorm';
import { PasswordResetRequestRepository } from '../dao/password-reset-request.repository';
import { DateTime } from 'luxon';
import { HashService } from '@tss/security/service';

@Injectable()
export class PasswordResetRequestServiceImpl implements PasswordResetRequestService {
  constructor(private readonly connection: Connection, private readonly hashService: HashService) {
  }

  createRequest(portalUserIdentifier: PortalUserIdentifier, requestMetaData: RequestMetaData) {
    let passwordResetRequest = new PasswordResetRequest();
    passwordResetRequest.portalUserIdentifier = portalUserIdentifier;
    passwordResetRequest.ipAddress = requestMetaData.ipAddress;
    passwordResetRequest.userAgent = requestMetaData.userAgent;

    return this.connection.transaction(entityManager => {
      return this.deactivateExistingPasswordReset(entityManager, portalUserIdentifier).then(() => {
        passwordResetRequest.expiresOn = DateTime.local().plus({ minutes: 15 }).toJSDate();
        let generatedCode = this.generateVerificationCode(5);
        return this.hashService.hash(generatedCode).then(hash => {
          passwordResetRequest.resetCodeHash = hash;
          passwordResetRequest.resetCode = generatedCode;
          return entityManager.save(passwordResetRequest);
        });
      });
    });

  }

  private deactivateExistingPasswordReset(entityManager: EntityManager, portalUserIdentifier: PortalUserIdentifier) {
    return this.connection.getCustomRepository(PasswordResetRequestRepository)
      .findByPortalUser(portalUserIdentifier.portalUser).then(passwordRequests => {
        let requests = passwordRequests.map(passwordRequest => {
          passwordRequest.deactivatedOn = new Date();
          return entityManager.save(passwordRequest);
        });
        return Promise.resolve(requests);
      });
  }


  private generateVerificationCode(count: number) {
    let verificationCode = [];
    for (let i = 1; i <= count; i++) {
      let randomNumber = Math.floor(Math.random() * 9) + 1;
      verificationCode.push(randomNumber);
    }
    return verificationCode.join('');
  }

}