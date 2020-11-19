import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { Interval } from 'luxon';
import { sign, SignOptions } from 'jsonwebtoken';
import { PasswordResetRequest } from '../../domain/entity/password-reset-request.entity';


export class PasswordResetJwsGenerator {
  private keyId: string;
  private key: string;


  public updateKey(keyEntry: { key: string, signature: SignatureKey }) {
    this.keyId = keyEntry.signature.keyId;
    this.key = keyEntry.key;
  }


  public hasKey(): boolean {

    return !!this.keyId;

  }


  public createJwt(passwordReset: PasswordResetRequest, expiration: Date): Promise<string> {

    let currentTime = new Date();
    let interval = Interval.fromDateTimes(currentTime, expiration);
    const signOptions: SignOptions = {
      algorithm: 'RS256',
      keyid: this.keyId,
      expiresIn: interval.count('second'),
      subject: passwordReset.portalUser.id.toString(),
      issuer: 'Tss_authentication_service',
      jwtid: passwordReset.id.toString(),
      header: {
        'kid': this.keyId,
      },
    };
    return new Promise((resolve, reject) => {
      sign({
        userId: passwordReset.portalUser.id.toString(),
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