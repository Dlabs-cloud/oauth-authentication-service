import { AuthKeyGenerator } from '../contracts/auth-key-generator.contracts';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { JwtDto } from '../data/jwt.dto';
import { AuthJwsGenerator } from './auth-jwt-generator.core';
import { KeyGenerator } from '../contracts/key-generator.contracts';
import { Connection } from 'typeorm';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { DateTime, Interval } from 'luxon';


export class RefreshTokenGeneratorCore implements AuthKeyGenerator {

  constructor(private readonly authKeyGenerator: AuthJwsGenerator,
              private readonly connection: Connection,
              private readonly keyGenerator: KeyGenerator) {
  }


  async onApplicationBootstrap() {
    if (this.authKeyGenerator.hasKey()) {
      console.log('Prevented duplicate initialization');
      return;
    }
    await this.connection.transaction(entityManager => {
      return this.keyGenerator.generateKey(entityManager, JwtType.REFRESH)
        .then(keyValue => {
          return this.authKeyGenerator.updateKey(keyValue);
        });
    });
  }

  generateJwt(refreshToken: RefreshToken): Promise<JwtDto> {
    let interval = Interval.fromDateTimes(DateTime.local(), refreshToken.expiresAt);
    let jwtDto = new JwtDto();
    jwtDto.secondsTillExpiry = interval.count('second');
    return this.authKeyGenerator.createJwt(refreshToken, refreshToken.expiresAt)
      .then(token => {
        jwtDto.token = token;
        return Promise.resolve(jwtDto);
      });
  }


}