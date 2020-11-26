import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';
import * as request from 'supertest';
import { factory } from '../domain/factory/factory';
import { SignatureKey } from '../domain/entity/signature-key.entity';
import { JwtType } from '../domain/constants/jwt-type.constant';
import { AsymmetricCrypto } from '@tss/common';

describe('signature-key e2e', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let keyPair: AsymmetricCrypto;
  let signatureKey: SignatureKey;

  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    keyPair = moduleRef.get<AsymmetricCrypto>(AsymmetricCrypto);
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();
    connection = getConnection();
    signatureKey = await keyPair.generateKeyPair().then(key => {
      return factory().upset(SignatureKey).use(signatureKey => {
        signatureKey.type = JwtType.ACCESS;
        signatureKey.publicKey = key.publicKey;
        return signatureKey;
      }).create();
    });

  });


  it('Test that a signature can be gotten with a kid', async () => {
    const url = `/key/${signatureKey.keyId}`;
    return request(applicationContext.getHttpServer())
      .get(url)
      .expect(200);
  });

  it('Test that the exponents and modules are gotten', async () => {
    const url = `/key/${signatureKey.keyId}`;
    return request(applicationContext.getHttpServer())
      .get(url)
      .expect(200).then(response => {
        let body = response.body;
        expect(body.use).toEqual('sig');
        expect(body.kid).toBeDefined();
        expect(body.kty).toBeDefined();
        expect(body.exponent).toBeDefined();
        expect(body.modulus).toBeDefined();
      });
  });

  it('Test that when a kid is not found a 404 is returned', () => {
    const url = `/key/${Date.now()}`;
    return request(applicationContext.getHttpServer())
      .get(url)
      .expect(404);
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });

});