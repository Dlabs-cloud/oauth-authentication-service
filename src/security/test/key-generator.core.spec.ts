import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { KeyGenerator } from '../contracts/key-generator.contracts';
import { Test } from '@nestjs/testing';
import { SecurityModule } from '../security.module';
import { ConfModule } from '../../conf/conf.module';
import { entityManager, transaction } from '@dlabs/test-starter/mocks/type-orm.mock';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { AsymmetricCrypto } from '@dlabs/security/../../../libs/common/src/security/service/key-generator';
import * as faker from 'faker';
import { CommonModule, Key } from '@dlabs/common';

describe('Security: Key generator - core', () => {
  let applicationContext: INestApplication;
  let connection: Connection;
  let keyGenerator: KeyGenerator;
  let asymmetricCrypto: AsymmetricCrypto;
  beforeAll(async () => {
    let moduleRef = await Test.createTestingModule({
      imports: [SecurityModule, ConfModule, CommonModule],
      providers: [],
    })
      .overrideProvider(Connection)
      .useValue({
        transaction: transaction,
      })
      .compile();
    keyGenerator = moduleRef.get<KeyGenerator>(KeyGenerator);
    connection = moduleRef.get<Connection>(Connection);
    asymmetricCrypto = moduleRef.get<AsymmetricCrypto>(AsymmetricCrypto);

  });


  it('Test that a key signature is generated', async () => {

    const key: Key = {
      algorithm: 'aes-256-cbc',
      format: 'pem',
      privateKey: faker.random.uuid(),
      publicKey: faker.random.uuid(),
    };
    let generateKeyPairInstance = jest.spyOn(asymmetricCrypto, 'generateKeyPair').mockResolvedValueOnce(key);
    await connection.transaction(async entityManager => {
      let keySignature = await keyGenerator.generateKey(entityManager, JwtType.ACCESS);
      expect(keySignature).toBeDefined();
      expect(keySignature.key).toEqual(key.privateKey);
      expect(keySignature.signature.type).toEqual(JwtType.ACCESS);
      expect(keySignature.signature.format).toEqual('pem');
      expect(keySignature.signature.algorithm).toEqual('aes-256-cbc');
      generateKeyPairInstance.mockRestore();
    });

  });


  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });

});