import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { PhoneNumberService } from '@dlabs/common/utils/phone-number/phone-number.service';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { PortalUserIdentifierVerificationRepository } from '../dao/portal-user-identifier-verification.repository';

import { DateTime } from 'luxon';
import { Connection, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HashService } from '@dlabs/common';


@Injectable()
export class PortalUserIdentifierVerificationServiceImpl implements PortalUserIdentifierVerificationService {
  constructor(private readonly phoneNumberService: PhoneNumberService,
              private readonly connection: Connection,
              private readonly hashService: HashService) {
  }

  async createVerification(identifier: string, identifierType: UserIdentifierType) {
    const currentTime = new Date();
    if (UserIdentifierType.PHONE_NUMBER === identifierType) {
      identifier = this.phoneNumberService.formatPhoneNumber(identifier);
    }

    return this.connection.transaction(async entityManager => {
      const verification = new PortalUserIdentificationVerification();
      verification.identifierType = identifierType;
      verification.identifier = identifier.toLowerCase();
      await this.deactivateAllActiveVerification(entityManager, identifier);
      verification.createdAt = currentTime;
      verification.expiresOn = DateTime.local().plus({ minutes: 15 }).toJSDate();
      const verificationCode = this.generateVerificationCode(5);

      verification.verificationCode = verificationCode;
      return this.hashService.hash(verificationCode).then(code => {
        verification.verificationCodeHash = code;
        return entityManager.save(verification).then(userVerification => {
          return {
            userVerification,
            verificationCode: userVerification.verificationCode,
          };
        });
      });

    });


  }


  private deactivateAllActiveVerification(entityManager: EntityManager, identifier) {
    let currentDate = new Date();

    return this.connection.getCustomRepository(PortalUserIdentifierVerificationRepository)
      .findAllActive(identifier).then(verifications => {
        let portalUserVerifications = verifications.map(verification => {
          verification.deactivatedOn = currentDate;
          return entityManager.save(verification);
        });
        return Promise.all(portalUserVerifications);
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
