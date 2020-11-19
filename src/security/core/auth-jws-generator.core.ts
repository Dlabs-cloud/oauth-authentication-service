import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { sign, SignOptions } from 'jsonwebtoken';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { DateTime, Interval } from 'luxon';
import { v4 as uuid } from 'uuid';

export class AuthJwsGenerator {
  private keyId: string;
  private key: string;


  public updateKey(keyEntry: { key: string, signature: SignatureKey }) {
    this.keyId = keyEntry.signature.keyId;
    this.key = keyEntry.key;
  }


  public hasKey(): boolean {

    return !!this.keyId;

  }

  public createJwt(refreshToken: RefreshToken, expiration: Date): Promise<string> {

    let currentTime = new Date();
    let interval = Interval.fromDateTimes(currentTime, expiration);
    const signOptions: SignOptions = {
      algorithm: 'RS256',
      keyid: this.keyId,
      expiresIn: interval.count('second'),
      subject: refreshToken.portalUser.id.toString(),
      issuer: 'Tss_authentication_service',
      jwtid: refreshToken.id.toString(),
      header: {
        'kid': this.keyId,
      },
    };
    return new Promise((resolve, reject) => {
      sign({
        userId: refreshToken.portalUser.id.toString(),
        nbf: Math.floor(currentTime.valueOf() / 1000),
      }, this.key, signOptions, (error, token) => {
        if (error) {
          return reject(error);
        }
        if (!token) {
          return reject('Token cannot be generated');
        }
        resolve(token);
      });
    });
  }
}