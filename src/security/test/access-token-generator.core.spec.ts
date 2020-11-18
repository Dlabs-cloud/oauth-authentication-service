import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AccessTokenGeneratorCore } from '../core/access-token-generator.core';
import { SecurityModule } from '../security.module';
import { AuthJwsGenerator } from '../core/auth-jwt-generator.core';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import * as faker from 'faker';
import { PortalUser } from '../../domain/entity/portal-user.entity';
import { ConfModule } from '../../conf/conf.module';
import { KeyGenerator } from '../contracts/key-generator.contracts';
import { transaction } from '@tss/test-starter/mocks/type-orm.mock';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { ACCESSKEYGENERATOR } from '../constants';

describe('Security: Access-token generator-core', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let keyGenerator: KeyGenerator;
  beforeAll(async () => {
    let moduleRef = await Test.createTestingModule({
      imports: [SecurityModule, ConfModule],
      providers: [],
    })
      .overrideProvider(Connection)
      .useValue({
        transaction: transaction,
      })
      .compile();
    keyGenerator = moduleRef.get<KeyGenerator>(KeyGenerator);
    connection = moduleRef.get<Connection>(Connection);

  });


  it('Test on application bootstrap', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let updateKey = jest.spyOn(authJwsGenerator, 'updateKey');
    let generateKey = jest.spyOn(keyGenerator, 'generateKey').mockResolvedValueOnce({
      key: faker.random.uuid(),
      signature: new SignatureKey(),
    });
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    await accessTokenGeneratorCore.onApplicationBootstrap();
    expect(generateKey).toBeCalledTimes(1);
    expect(updateKey).toBeCalledTimes(1);
    generateKey.mockRestore();
    updateKey.mockRestore();
  });


  it('Test that when a auth key is generated another is not generated', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let updateKey = jest.spyOn(authJwsGenerator, 'hasKey').mockReturnValueOnce(true);
    let generateKey = jest.spyOn(keyGenerator, 'generateKey').mockResolvedValueOnce({
      key: faker.random.uuid(),
      signature: new SignatureKey(),
    });
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    await accessTokenGeneratorCore.onApplicationBootstrap();
    expect(updateKey).toBeCalledTimes(1);
    expect(generateKey).toBeCalledTimes(0);
    generateKey.mockRestore();
    updateKey.mockRestore();
  });
  it('test that a jwt dto can be created', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let createJwt = jest.spyOn(authJwsGenerator, 'createJwt').mockResolvedValueOnce('jwttoken');
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    const refreshToken = {
      accessExpiresAt: faker.date.future(),
      expiresAt: faker.date.future(),
      portalUser: new PortalUser(),
    } as RefreshToken;
    let jwtDto = await accessTokenGeneratorCore.generateJwt(refreshToken);
    expect(jwtDto).toBeDefined();
    expect(jwtDto.token).toEqual('jwttoken');
    expect(jwtDto.secondsTillExpiry).toBeDefined();
    expect(createJwt).toBeCalled();
  });

  it('Test that a jws generator is called when creating a jwt', () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let createJwt = jest.spyOn(authJwsGenerator, 'createJwt').mockResolvedValueOnce('jwttoken');
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    const refreshToken = {
      accessExpiresAt: faker.date.future(),
      expiresAt: faker.date.future(),
      portalUser: new PortalUser(),
    } as RefreshToken;
    accessTokenGeneratorCore.generateJwt(refreshToken);
    expect(createJwt).toBeCalled();
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });

});