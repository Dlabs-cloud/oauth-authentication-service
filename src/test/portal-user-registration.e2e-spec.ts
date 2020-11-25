import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import * as faker from 'faker';
import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';
import { Gender } from '../domain/constants/gender.constant';
import * as request from 'supertest';
import { factory } from '../domain/factory/factory';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { HashService } from '@tss/security/service';

describe('Portal -user registration controller', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();

    connection = getConnection();
  });


  it('Test that a portal user can be created ', () => {
    const requestPayload: UserRegistrationApiRequest = {
      displayName: faker.name.lastName(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      gender: Gender.FEMALE,
      isPasswordUpdateRequired: true,
      lastName: faker.name.lastName(),
      otherNames: faker.name.firstName(),
      password: faker.random.uuid(),
      phoneNumber: `${faker.phone.phoneNumber('+234#########')}`,
    };
    const url = `/users`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(requestPayload)
      .expect(201);
  });


  it('Test that valid valid response is gotten after sighup', () => {
    const requestPayload: UserRegistrationApiRequest = {
      displayName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      firstName: faker.name.firstName(),
      gender: Gender.FEMALE,
      isPasswordUpdateRequired: true,
      lastName: faker.name.lastName(),
      otherNames: faker.name.firstName(),
      password: faker.random.uuid(),
      phoneNumber: `${faker.phone.phoneNumber('+2347########')}`,
    };
    const url = `/users`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(requestPayload)
      .expect(201)
      .then(response => {
        let payload = response.body;
        expect(payload).toBeDefined();
        expect(payload.token_type).toEqual('Bearer');
        expect(payload.displayName).toEqual(requestPayload.displayName);
        expect(payload.firstName).toEqual(requestPayload.firstName);
        expect(payload.lastName).toEqual(requestPayload.lastName);
        expect(payload.gender).toEqual(requestPayload.gender);
        expect(payload.emailAddresses).toEqual([requestPayload.email]);
        expect(payload.phoneNumbers).toEqual([requestPayload.phoneNumber]);
        expect(payload.refresh_token).toBeDefined();
        expect(payload.access_token).toBeDefined();
        expect(payload.secondsTillExpiry).toBeDefined();
        expect(payload.expires_at).toBeDefined();
      });
  });

  it('Test that a user with valid email verification code can sign up', () => {
    let hashService = new HashService();
    let randomValue = faker.random.alphaNumeric(5);
    return hashService.hash(randomValue).then(hash => {
      return factory().upset(PortalUserIdentificationVerification).use(verification => {
        verification.identifier = faker.internet.email().toLowerCase();
        verification.identifierType = UserIdentifierType.EMAIL;
        verification.deactivatedOn = null;
        verification.usedOn = null;
        verification.verificationCodeHash = hash;
        verification.verificationCode = randomValue;
        return verification;
      }).create();
    }).then(verification => {
      const requestPayload: UserRegistrationApiRequest = {
        displayName: faker.name.lastName(),
        email: verification.identifier,
        firstName: faker.name.firstName(),
        gender: Gender.FEMALE,
        isPasswordUpdateRequired: true,
        emailVerificationCode: verification.verificationCode,
        lastName: faker.name.lastName(),
        otherNames: faker.name.firstName(),
        password: faker.random.uuid(),
        phoneNumber: `${faker.phone.phoneNumber('+234#########')}`,
      };
      return Promise.resolve(requestPayload);
    }).then(requestPayload => {
      const url = `/users`;
      return request(applicationContext.getHttpServer())
        .post(url)
        .send(requestPayload)
        .expect(201);
    });
  });

  it('Test that a user with invalid email verification code cannot  sign up', () => {
    const requestPayload: UserRegistrationApiRequest = {
      displayName: faker.name.lastName(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      gender: Gender.FEMALE,
      isPasswordUpdateRequired: true,
      emailVerificationCode: faker.random.alphaNumeric(7),
      lastName: faker.name.lastName(),
      otherNames: faker.name.firstName(),
      password: faker.random.uuid(),
      phoneNumber: `${faker.phone.phoneNumber('+234#########')}`,
    };
    const url = `/users`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(requestPayload)
      .expect(400)
      .then(response => {
        expect(response.body.message).toEqual('Verification with identifier does not exist');
      });
  });

  it('Test that a user cannot be created with existing identifier', () => {
    return factory().upset(PortalUserIdentifier).use(portalUserIdentifier => {
      portalUserIdentifier.identifier = faker.internet.email().toLowerCase();
      portalUserIdentifier.identifierType = UserIdentifierType.EMAIL;
      return portalUserIdentifier;
    }).create().then(portalUserIdentifier => {
      const requestPayload: UserRegistrationApiRequest = {
        displayName: faker.name.lastName(),
        email: portalUserIdentifier.identifier,
        firstName: faker.name.firstName(),
        gender: Gender.FEMALE,
        isPasswordUpdateRequired: true,
        lastName: faker.name.lastName(),
        otherNames: faker.name.firstName(),
        password: faker.random.uuid(),
        phoneNumber: `${faker.phone.phoneNumber('+234#########')}`,
      };
      return Promise.resolve(requestPayload);
    }).then(requestPayload => {
      return factory().upset(PortalUserIdentifier).use(portalUserIdentifier => {
        portalUserIdentifier.identifier = `${faker.phone.phoneNumber('+234#########')}`;
        portalUserIdentifier.identifierType = UserIdentifierType.PHONE_NUMBER;
        return portalUserIdentifier;
      }).create().then(portalUserIdentifier => {
        requestPayload.phoneNumber = portalUserIdentifier.identifier;
        return Promise.resolve(requestPayload);
      });
    }).then(requestPayload => {
      const url = `/users`;
      return request(applicationContext.getHttpServer())
        .post(url)
        .send(requestPayload)
        .expect(400);
    }).then(response => {
      expect(response.body.errors.phoneNumber).toEqual('phone number has already been used');
      expect(response.body.errors.email).toEqual('Email has already been used');
      return Promise.resolve(response);
    });
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });


});