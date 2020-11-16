import { Inject, Injectable } from '@nestjs/common';
import { PortalUserRegistrationService } from '../service/portal-user-registration.service';
import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';
import { PortalUser } from '../domain/entity/portal-user.entity';
import { Connection, EntityManager } from 'typeorm';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { PortalUserIdentifierVerificationRepository } from '../dao/portal-user-identifier-verification.repository';
import { HashService } from '@tss/security/service';
import { IllegalArgumentException } from '@tss/common';
import { PhoneNumberService } from '@tss/common/utils/phone-number/phone-number.service';
import { PortalUserData } from '../domain/entity/portal-user-data.entity';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { ImplicitAuthenticationService } from '../service/implicit-authentication.service';
import { isBlank } from '@tss/common/utils/string.utlls';

@Injectable()
export class PortalUserRegistrationServiceImpl implements PortalUserRegistrationService {

  constructor(private readonly connection: Connection,
              private readonly phoneNumberService: PhoneNumberService,
              @Inject(ImplicitAuthenticationService)
              private readonly implicitAuthenticationService: ImplicitAuthenticationService,
              private readonly hashService: HashService) {
  }

  async register(userData: UserRegistrationApiRequest, requestMetaData: RequestMetaData): Promise<PortalUserAuthentication> {
    let portalUser = new PortalUser();
    portalUser.firstName = userData.firstName.normalize();
    portalUser.lastName = userData.lastName.normalize();
    portalUser.otherName = userData.otherNames;
    portalUser.displayName = userData.displayName;
    portalUser.gender = userData.gender;


    if (!isBlank(userData.password)) {

      await this.hashService.hash(userData.password).then(hash => {
        portalUser.password = hash;
        portalUser.passwordUpdateRequired = userData.isPasswordUpdateRequired;
      });

    }

    return this.connection.transaction(async entityManager => {
      const identifiers: PortalUserIdentifier[] = [];
      await entityManager.save(portalUser);


      if (!isBlank(userData.email)) {
        identifiers.push(await this.createUserEmailIdentifier(entityManager, portalUser, userData));
      }

      if (!isBlank(userData.phoneNumber)) {
        identifiers.push(await this.createPhoneNumberIdentifier(entityManager, portalUser, userData));
      }

      if (!identifiers.length) {
        throw new IllegalArgumentException('Identifier must be provided');
      }

      if (userData.data) {
        let userDataPromise = userData.data.map(data => {
          let portalUserData = new PortalUserData();
          portalUserData.name = data.name;
          portalUserData.value = data.value;
          portalUserData.portalUser = portalUser;
          return entityManager.save(portalUserData);
        });
        await Promise.all(userDataPromise);
      }


      return this.implicitAuthenticationService.createSignUpAuthentication(entityManager, portalUser, requestMetaData);
    });


  }

  private createPhoneNumberIdentifier(entityManager: EntityManager, portalUser: PortalUser, userData: UserRegistrationApiRequest) {
    const portalUserIdentifier = new PortalUserIdentifier();
    portalUserIdentifier.identifier = this.phoneNumberService.formatPhoneNumber(userData.phoneNumber);
    portalUserIdentifier.portalUser = portalUser;
    portalUserIdentifier.identifierType = UserIdentifierType.PHONE_NUMBER;
    return entityManager.save(portalUserIdentifier);

  }

  private async createUserEmailIdentifier(entityManager: EntityManager, portalUser: PortalUser, userData: UserRegistrationApiRequest) {
    let portalUserIdentifier = new PortalUserIdentifier();
    portalUserIdentifier.identifierType = UserIdentifierType.EMAIL;
    portalUserIdentifier.portalUser = portalUser;
    portalUserIdentifier.identifier = userData.email;

    if (userData.emailVerificationCode) {
      await this.resolveVerification(entityManager, portalUserIdentifier, userData.emailVerificationCode);
    }

    return entityManager.save(portalUserIdentifier);

  }

  private async resolveVerification(entityManager: EntityManager, userIdentifier: PortalUserIdentifier, verificationCode: string) {
    let now = new Date();
    let existingVerifications = await this.connection
      .getCustomRepository(PortalUserIdentifierVerificationRepository)
      .findAllActive(userIdentifier.identifier);
    if (!existingVerifications) {
      throw new IllegalArgumentException('Verification with identifier does not exist');
    }

    let verification = existingVerifications[0];

    await this.hashService.compare(verificationCode, verification.verificationCodeHash)
      .then(isSame => {
        if (!isSame) {
          throw  new IllegalArgumentException('Verification code cannot be verified ');
        }
        return Promise.resolve(verificationCode);
      });

    userIdentifier.verification = verification;
    userIdentifier.dateVerified = now;
    userIdentifier.verified = true;
    verification.usedOn = now;
    await entityManager.save(verification);
    let existingVerificationsPromise = existingVerifications.map(existingVerification => {
      existingVerification.deactivatedOn = now;
      return entityManager.save(existingVerification);
    });

    await Promise.all(existingVerificationsPromise);


  }

}