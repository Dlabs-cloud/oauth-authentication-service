import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { PhoneNumberService } from '@tss/common/utils/phone-number/phone-number.service';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PortalUserIdentifierVerificationRepository } from '../dao/portal-user-identifier-verification.repository';
import { Connection, EntityManager } from 'typeorm';
import DateTime from 'luxon/src/datetime.js';
import { HashService } from '@tss/security/service';

export class PortalUserIdentifierVerificationServiceImpl implements PortalUserIdentifierVerificationService {
  constructor(private readonly phoneNumberService: PhoneNumberService,
              private readonly connection: Connection,
              private readonly hashService: HashService,
              @InjectRepository(PortalUserIdentifierVerificationRepository)
              private readonly portalUserIdentifierVerificationRepository: PortalUserIdentifierVerificationRepository) {
  }

  async createVerification(identifier: string, identifierType: UserIdentifierType) {
    let currentTime = new Date();
    if (UserIdentifierType.PHONE_NUMBER === identifierType) {
      identifier = this.phoneNumberService.formatPhoneNumber(identifier);
    }

    return this.connection.transaction(async entityManager => {
      let verification = new PortalUserIdentificationVerification();
      verification.identifierType = identifierType;
      verification.identifier = identifier;
      await this.deactivateAllActiveVerification(entityManager, identifier);
      verification.createdAt = currentTime;
      verification.expiresOn = DateTime.local().plus({ minutes: 15 }).toJSDate();
      let verificationCode = this.generateVerificationCode(5);

      verification.verificationCode = verificationCode;
      this.hashService.hash(verificationCode, 20).then(code => {
        verification.verificationCodeHash = code;
      });
      return entityManager.save(verification).then(userVerification => {
        return Promise.resolve({
          userVerification,
          verificationCode: verification.verificationCode,
        });
      });
    });


  }


  private deactivateAllActiveVerification(entityManager: EntityManager, identifier) {
    let currentDate = new Date();

    return this.portalUserIdentifierVerificationRepository
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
    return verificationCode.join();
  }


}