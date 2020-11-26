import { generateKeyPairSync } from 'crypto';
import { Key } from '@tss/common/security/data/key.dto';

export class AsymmetricCrypto {
  public generateKeyPair(): Promise<Key> {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,  // the length of your key in bits
      publicKeyEncoding: {
        type: 'spki',       // recommended to be 'spki' by the Node.js docs
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
        format: 'pem',
      },
    });
    const key: Key = {
      format: 'pem',
      algorithm: 'RS256',
      privateKey: privateKey,
      publicKey: publicKey,
    };
    return Promise.resolve(key);
  }
}