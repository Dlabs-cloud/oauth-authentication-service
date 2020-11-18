import { AuthJwsGenerator } from '../core/auth-jwt-generator.core';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { Test } from '@nestjs/testing';
import { SecurityModule } from '@tss/security';
import { AsymmetricCrypto } from '@tss/security/service/key-generator';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import * as faker from 'faker';
import { decode, verify } from 'jsonwebtoken';
import { Key } from '@tss/security/data/key.dto';
import { PortalUser } from '../../domain/entity/portal-user.entity';
import { v4 as uuid } from 'uuid';
import { JwtType } from '../../domain/constants/jwt-type.constant';

describe('Security: Auth-jwt-generator-core', () => {

  let asymmetricCrypto: AsymmetricCrypto;
  let key: Key;
  let refreshToken: RefreshToken;
  let signatureKey: SignatureKey;
  beforeAll(async () => {
    let moduleRef = await Test.createTestingModule({
      imports: [SecurityModule],
      providers: [],
    }).compile();
    asymmetricCrypto = moduleRef.get<AsymmetricCrypto>(AsymmetricCrypto);
    key = await asymmetricCrypto.generateKeyPair();
    let portalUser = new PortalUser();
    portalUser.id = faker.random.number();
    refreshToken = {
      id: faker.random.number(),
      accessExpiresAt: faker.date.future(),
      expiresAt: faker.date.future(),
      portalUser: portalUser,
    } as RefreshToken;
    signatureKey = {
      algorithm: 'RS256',
      encodedKey: key.publicKey,
      format: 'pem',
      keyId: uuid(),
      type: JwtType.ACCESS,
    } as SignatureKey;
  });


  it('Test that the token generated was signed', async () => {

    let keyVal = await asymmetricCrypto.generateKeyPair();
    signatureKey.encodedKey = keyVal.publicKey;
    let authJwsGenerator = new AuthJwsGenerator();
    authJwsGenerator.updateKey({
      key: keyVal.privateKey,
      signature: signatureKey,
    });

    let token = await authJwsGenerator.createJwt(refreshToken, refreshToken.expiresAt);
    let jwtPayload = verify(token, signatureKey.encodedKey, {
      algorithms: ['RS256'],
    });

    expect(jwtPayload).toBeDefined();
  });

  it('Test that token key generated can be resolved', async () => {

    let authJwsGenerator = new AuthJwsGenerator();
    authJwsGenerator.updateKey({
      key: key.privateKey,
      signature: signatureKey,
    });
    let token = await authJwsGenerator.createJwt(refreshToken, refreshToken.expiresAt);
    let decodedToken = decode(token, { complete: true });
    // @ts-ignore
    let header = decodedToken.header;
    // @ts-ignore
    let payload = decodedToken.payload;
    expect(header.alg).toEqual(signatureKey.algorithm);
    expect(header.kid).toEqual(signatureKey.keyId);
    expect(payload.userId).toStrictEqual(refreshToken.portalUser.id.toString());
    expect(payload.iss).toEqual('Tss_authentication_service');
    expect(payload.jti).toEqual(refreshToken.id.toString());
    expect(payload.exp).toBeDefined();
  });

  it('Test that a key signature is generated', async () => {
    let authJwsGenerator = new AuthJwsGenerator();
    authJwsGenerator.updateKey({
      key: key.privateKey,
      signature: signatureKey,
    });
    let token = await authJwsGenerator.createJwt(refreshToken, refreshToken.expiresAt);
    expect(token).toBeDefined();
  });


});