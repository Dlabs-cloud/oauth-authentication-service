import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';
import * as faker from 'faker';
import * as request from 'supertest';
import { factory } from '../domain/factory/factory';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PasswordResetEmailSenderService } from '../service/password-reset-email-sender.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';

describe('Password reset request', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let passwordResetEmailSenderService: PasswordResetEmailSenderService;
  let emailSender;
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();
    connection = getConnection();
    passwordResetEmailSenderService = moduleRef.get<PasswordResetEmailSenderService>(PasswordResetEmailSenderService);
    emailSender = jest.spyOn(passwordResetEmailSenderService, 'sendResendLink').mockResolvedValueOnce('send');
  });


  it('Test that a user with invalid identifier cannot request for password', () => {
    const url = `/password-resets/${faker.internet.email()}`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .expect(400)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('Identifier is not known');
      });
  });


  it('Test that a user with valid email identifier can reset their emails', () => {
    return factory().upset(PortalUserIdentifier).use(portalUserIdentifier => {
      portalUserIdentifier.identifier = faker.internet.email().toLowerCase();
      portalUserIdentifier.identifierType = UserIdentifierType.EMAIL;
      return portalUserIdentifier;
    }).create().then(portalUserIdentifier => {
      const url = `/password-resets/${portalUserIdentifier.identifier}`;
      return request(applicationContext.getHttpServer())
        .post(url)
        .expect(204)
        .then(response => {
          expect(emailSender).toBeCalledTimes(1);
        });
    });


  });


  afterAll(async () => {
    emailSender.mockRestore();
    await connection.close();
    await applicationContext.close();

  });


});