import { KeyGenerator } from '../contracts/key-generator.contracts';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { generateKeyPair } from 'crypto';
import { Key } from '../data/key.dto';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EntityManager } from 'typeorm';

@Injectable()
export class KeyGeneratorCore implements KeyGenerator {
  generateKey(entityManager: EntityManager, jwtTokenType: JwtType): Promise<{ key: string; signature: SignatureKey }> {

    return this.generateKeyPair().then(key => {
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

  private generateKeyPair(): Promise<Key> {
    return new Promise((resolve, reject) => {
      generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: uuid(),
        },
      }, (err, publicKey, privateKey) => {
        if (err) {
          return reject(err);
        }
        const key: Key = {
          algorithm: 'rsa',
          format: 'pem',
          privateKey: privateKey,
          publicKey: publicKey,
        };
        resolve(key);
      });
    });
  }

}