import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { KeyGenerator } from '../contracts/key-generator.contracts';
import { Test } from '@nestjs/testing';
import { SecurityModule } from '../security.module';
import { ConfModule } from '../../conf/conf.module';
import { transaction } from '@dlabs/test-starter/mocks/type-orm.mock';
import { AuthJwsGenerator } from '../core/auth-jws-generator.core';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { RefreshTokenGeneratorCore } from '../core/refresh-token-generator.core';
import * as faker from 'faker';

describe('Security: Refresh-token-generator-core', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let keyGenerator: KeyGenerator;
  let refreshToken: RefreshToken;
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
    refreshToken = {
      expiresAt: faker.date.future(),
    } as RefreshToken;

  });


  it('Test on application bootstrap', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let updateKey = jest.spyOn(authJwsGenerator, 'updateKey');
    let generateKey = jest.spyOn(keyGenerator, 'generateKey').mockResolvedValueOnce({
      key: faker.random.uuid(),
      signature: new SignatureKey(),
    });
    let accessTokenGeneratorCore = new RefreshTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
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
    let accessTokenGeneratorCore = new RefreshTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    await accessTokenGeneratorCore.onApplicationBootstrap();
    expect(updateKey).toBeCalledTimes(1);
    expect(generateKey).toBeCalledTimes(0);
    generateKey.mockRestore();
    updateKey.mockRestore();

  });
  it('test that a jwt dto can be created', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let createJwt = jest.spyOn(authJwsGenerator, 'createJwt').mockResolvedValueOnce('jwttoken');
    let accessTokenGeneratorCore = new RefreshTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    let jwtDto = await accessTokenGeneratorCore.generateJwt(refreshToken);
    expect(jwtDto).toBeDefined();
    expect(jwtDto.token).toEqual('jwttoken');
    expect(jwtDto.secondsTillExpiry).toBeDefined();
    expect(createJwt).toBeCalled();
  });

  it('Test that a jws generator is called when creating a jwt', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    let createJwt = jest.spyOn(authJwsGenerator, 'createJwt').mockResolvedValueOnce('jwttoken');
    let accessTokenGeneratorCore = new RefreshTokenGeneratorCore(authJwsGenerator, connection, keyGenerator);
    accessTokenGeneratorCore.generateJwt(refreshToken);
    expect(createJwt).toBeCalled();
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });

});