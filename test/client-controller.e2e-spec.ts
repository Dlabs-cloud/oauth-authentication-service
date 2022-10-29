import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import { ValidatorTransformerPipe } from '@dlabs/common/pipes/validator-transformer.pipe';
import * as request from 'supertest';
import * as faker from 'faker';


describe('Client-controller-e2e', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();
    connection = getConnection();
  });


  test('Test that a client can be created', () => {
    const payload = {
      name: faker.random.alphaNumeric(),
      email: faker.internet.email(),
    };
    const url = `/clients`;
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(payload)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('Successfully');
        const responseData = response.body.data;
        expect(responseData.email).toBeDefined();
        expect(responseData.identifier).toBeDefined();
        expect(responseData.secret).toBeDefined();
      });
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });
});
