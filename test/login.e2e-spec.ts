import { TestingModule } from '@nestjs/testing';
import { baseTestingModule, signUpUser } from './test-utils';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';
import { Connection, getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { PortalUserRegistrationService } from '../src/service/portal-user-registration.service';
import * as request from 'supertest';
import { LoginRequest } from '../src/data/request/login.request';
import * as faker from 'faker';

describe('Login e2e', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let user: { identifier, password };
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();
    connection = getConnection();
    const userRegistrationService = moduleRef.get<PortalUserRegistrationService>(PortalUserRegistrationService);
    user = await signUpUser(userRegistrationService);
  });


  it('Test that an invalid user cannot login', () => {
    const loginRequest: LoginRequest = {
      identifier: faker.internet.email(),
      password: user.password,
    };
    const url = '/login';
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(loginRequest);
  });

  it('Test that a valid user can login and get tokens', () => {
    const loginRequest: LoginRequest = {
      identifier: user.identifier,
      password: user.password,
    };
    const url = '/login';
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(loginRequest)
      .expect(200).then(response => {
        const payload = response.body.data;
        expect(payload).toBeDefined();
        expect(payload.token_type).toEqual('Bearer');
        expect(payload.displayName).toBeDefined();
        expect(payload.firstName).toBeDefined();
        expect(payload.lastName).toBeDefined();
        expect(payload.gender).toBeDefined();
        expect(payload.emailAddresses).toBeDefined();
        expect(payload.phoneNumbers).toBeDefined();
        expect(payload.refresh_token).toBeDefined();
        expect(payload.access_token).toBeDefined();
        expect(payload.secondsTillExpiry).toBeDefined();
        expect(payload.expires_at).toBeDefined();
      });

  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });
});
