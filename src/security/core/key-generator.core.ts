import { KeyGenerator } from '../contracts/key-generator.contracts';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EntityManager } from 'typeorm';
import { AsymmetricCrypto } from '@tss/security/service/key-generator';

@Injectable()
export class KeyGeneratorCore implements KeyGenerator {
  constructor(private readonly asymmetricCrypto: AsymmetricCrypto) {
  }

  generateKey(entityManager: EntityManager, jwtTokenType: JwtType): Promise<{ key: string; signature: SignatureKey }> {

    return this.asymmetricCrypto.generateKeyPair().then(key => {
      let signatureKey = new SignatureKey();
      signatureKey.algorithm = key.algorithm;
      signatureKey.encodedKey = key.publicKey;
      signatureKey.format = key.format;
      signatureKey.type = jwtTokenType;
      signatureKey.keyId = uuid();
      return entityManager.save(signatureKey).then(signatureKey => {
        let mapEntry = {
          key: key.privateKey,
          signature: signatureKey,
        };
        return Promise.resolve(mapEntry);
      });
    });
  }

}