import { PasswordResetRequest } from '../../domain/entity/password-reset-request.entity';
import { AuthJwsGenerator } from './auth-jws-generator.core';
import { Connection } from 'typeorm';
import { KeyGenerator } from '../contracts/key-generator.contracts';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { JwtDto } from '../data/jwt.dto';
import { DateTime, Interval } from 'luxon';
import { PasswordResetJwsGenerator } from './password-reset-jws-generator.core';
import { PasswordResetGenerator } from '../contracts/password-reset-generator.contracts';

export class PasswordResetGeneratorCore implements PasswordResetGenerator {

  constructor(private readonly authKeyGenerator: PasswordResetJwsGenerator,
              private readonly connection: Connection,
              private readonly keyGenerator: KeyGenerator) {
  }


  async onApplicationBootstrap() {
    if (this.authKeyGenerator.hasKey()) {
      return;
    }
    await this.connection.transaction(entityManager => {
      return this.keyGenerator.generateKey(entityManager, JwtType.PASSWORD_RESET)
        .then(keyValue => {
          return this.authKeyGenerator.updateKey(keyValue);
        });
    });
  }


  generateJwt(passwordResetRequest: PasswordResetRequest) {
    let interval = Interval.fromDateTimes(DateTime.local(), passwordResetRequest.expiresOn);
    let jwtDto = new JwtDto();
    jwtDto.secondsTillExpiry = interval.count('second');
    return this.authKeyGenerator.createJwt(passwordResetRequest, passwordResetRequest.expiresOn)
      .then(token => {
        jwtDto.token = token;
        return Promise.resolve(jwtDto);
      });
  }
}