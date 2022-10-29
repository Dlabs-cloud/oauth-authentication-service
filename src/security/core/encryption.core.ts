import { Encryption } from '../contracts/encrption.contracts';
import * as crypto from 'crypto';

export class EncryptionCore implements Encryption {
  private algorithm = 'aes-192-cbc';
  private key;

  constructor(private readonly secret: string) {
    try {
      this.key = crypto.scryptSync(secret, 'salt', 24);
    }catch (e) {

    }

  }

  encrypt(clearText: string): Promise<string> {
    return new Promise(resolve => {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(clearText, 'utf8', 'hex');
      const encryptionKey = [
        encrypted + cipher.final('hex'),
        Buffer.from(iv).toString('hex'),
      ].join('|');
      return resolve(encryptionKey);
    });

  }

  decrypt(encryptedText: string): Promise<string> {
    return new Promise(resolve => {
      const [encrypted, iv] = encryptedText.split('|');
      if (!iv) throw new Error('IV not found');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, 'hex'),
      );
      const decryption = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
      return resolve(decryption);

    });
  }


}
