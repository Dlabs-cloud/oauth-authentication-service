import { KeyGenerator } from '../contracts/key-generator.contracts';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { JwtDto } from '../data/jwt.dto';
import { AuthJwsGenerator } from './auth-jwt-generator.core';
import { Connection } from 'typeorm';
import { AuthKeyGenerator } from '../contracts/auth-key-generator.contracts';
import { DateTime, Interval } from 'luxon';


export class AccessTokenGeneratorCore implements AuthKeyGenerator {


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
      return this.keyGenerator.generateKey(entityManager, JwtType.ACCESS)
        .then(keyValue => {
          return this.authKeyGenerator.updateKey(keyValue);
        });
    });
  }

  generateJwt(refreshToken: RefreshToken): Promise<JwtDto> {
    let jwtDto = new JwtDto();
    let interval = Interval.fromDateTimes(DateTime.local(), refreshToken.accessExpiresAt);
    jwtDto.secondsTillExpiry = interval.count('second');
    return this.authKeyGenerator.createJwt(refreshToken, refreshToken.accessExpiresAt)
      .then(token => {

        jwtDto.token = token;

        return Promise.resolve(jwtDto);
      });
  }


}