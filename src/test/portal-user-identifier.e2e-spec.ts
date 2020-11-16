import { Connection, getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import * as request from 'supertest';
import * as faker from 'faker';
import { factory } from '../domain/factory/factory';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { DateTime } from 'luxon';
import { PortalUserIdentifierVerificationRepository } from '../dao/portal-user-identifier-verification.repository';

describe('Portal-user-identifier-controller', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    // applicationContext.useGlobalPipes(new ValidatorTransformPipe());
    await applicationContext.init();

    connection = getConnection();
  });

  it('Test that a user identifier can created with email', () => {
    const url = `/user-emails/${faker.internet.email()}/verification-code`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .expect(201);
  });

  it('Test that a verified portal user cannot be used', async () => {
    let identifier = await factory().upset(PortalUserIdentifier).use(identifier => {
      identifier.verified = true;
      return identifier;
    }).create();
    const url = `/user-emails/${identifier.identifier}/verification-code`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .expect(409);
  });

  it('Test that all existing verification are deactivated before creating a new one', async () => {
    let identifierEmail = faker.internet.email();
    await factory().upset(PortalUserIdentificationVerification).use(verification => {
      verification.usedOn = null;
      verification.deactivatedOn = null;
      verification.identifier = identifierEmail;
      verification.expiresOn = DateTime.local().plus({ minutes: 15 }).toJSDate();
      return verification;
    }).createMany(3);
    const url = `/user-emails/${identifierEmail}/verification-code`;
    await request(applicationContext.getHttpServer())
      .post(url)
      .expect(201);

    await connection.getCustomRepository(PortalUserIdentifierVerificationRepository)
      .findAllActive(identifierEmail).then(verifications => {
        expect(1).toEqual(verifications.length);
      });

  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });

});