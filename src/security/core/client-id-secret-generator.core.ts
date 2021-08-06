import { ClientIdSecretGenerator } from '../contracts/clientIdSecret-generator.contracts';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';


@Injectable()
export class ClientIdSecretGeneratorCore implements ClientIdSecretGenerator {

  generateId(): Promise<string> {
    return new Promise(resolve => {
      const randomString = this
        .generateRandomString(32, `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`);
      resolve(randomString);
    });
  }

  generateSecret(): Promise<string> {
    return new Promise(resolve => {
      const randomString = this
        .generateRandomString(64, `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`);
      resolve(randomString);
    });

  }


  private generateRandomString(length: number, chars: string): string {
    if (!chars) {
      throw new Error('Argument \'chars\' is undefined');
    }

    const charsLength = chars.length;
    if (charsLength > 256) {
      throw new Error('Argument \'chars\' should not have more than 256 characters'
        + ', otherwise unpredictability will be broken');
    }

    const randomBytes = crypto.randomBytes(length);
    const result = new Array(length);

    let cursor = 0;
    for (let i = 0; i < length; i++) {
      cursor += randomBytes[i];
      result[i] = chars[cursor % charsLength];
    }

    return result.join('');
  }

}
