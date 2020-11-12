import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { sign, SignOptions } from 'jsonwebtoken';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { DateTime, Interval } from 'luxon';

export class AuthJwsGenerator {
  private keyId: string;
  private key: string;


  public updateKey(keyEntry: { key: string, signature: SignatureKey }) {
    this.keyId = keyEntry.signature.keyId;
    this.key = keyEntry.key;
  }


  public hasKey() {

    return !!this.keyId;

  }

  public createJwt(refreshToken: RefreshToken, expiration: Date): Promise<string> {

    let currentTime = DateTime.local();
    let interval = Interval.fromDateTimes(currentTime, expiration);
    const signOptions: SignOptions = {
      algorithm: 'HS256',
      keyid: this.keyId,
      expiresIn: interval.count('seconds'),
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