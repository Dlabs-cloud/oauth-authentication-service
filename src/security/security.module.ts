import { Module } from '@nestjs/common';
import { RequestMetaDataInterceptor } from './interceptors/request-meta-data.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthJwsGenerator } from './core/auth-jws-generator.core';
import { RefreshTokenGeneratorCore } from './core/refresh-token-generator.core';
import { AccessTokenGeneratorCore } from './core/access-token-generator.core';
import {
  ACCESSCLAIMEXTRACTOR,
  ACCESSKEYGENERATOR, PASSWORDCLAIMEXTRACTOR,
  REFRESHCLAIMEXTRACTOR,
  REFRESHKEYGENERATOR,
} from './constants';
import { Connection } from 'typeorm';
import { KeyGenerator } from './contracts/key-generator.contracts';
import { KeyGeneratorCore } from './core/key-generator.core';
import { SecurityModule as TssSecurityModule } from '@tss/security';
import { ClaimsExtractorCore } from './core/claims-extractor.core';
import { JwtType } from '../domain/constants/jwt-type.constant';
import { AccessConstrainInterceptor } from './interceptors/access-constrain.interceptor';
import { PasswordResetGeneratorCore } from './core/password-reset-generator.core';
import { PasswordResetJwsGenerator } from './core/password-reset-jws-generator.core';
import { PasswordResetGenerator } from './contracts/password-reset-generator.contracts';


const keyGenerator = {
  provide: KeyGenerator,
  useExisting: KeyGeneratorCore,

};

const refreshTokenGenerator = {
  provide: REFRESHKEYGENERATOR,
  useFactory: async (connection: Connection, keyGenerator: KeyGenerator) => {
    let refreshTokenGeneratorCore = new RefreshTokenGeneratorCore(new AuthJwsGenerator(), connection, keyGenerator);
    await refreshTokenGeneratorCore.onApplicationBootstrap();
    return refreshTokenGeneratorCore;
  },
  inject: [Connection, KeyGenerator],
};

const accessKeyGenerator = {
  provide: ACCESSKEYGENERATOR,
  useFactory: async (connection: Connection, keyGenerator: KeyGenerator) => {
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(new AuthJwsGenerator(), connection, keyGenerator);
    await accessTokenGeneratorCore.onApplicationBootstrap();
    return accessTokenGeneratorCore;
  },
  inject: [Connection, KeyGenerator],
};

const passwordResetGenerator = {
  provide: PasswordResetGenerator,
  useFactory: async (connection: Connection, keyGenerator: KeyGenerator) => {
    let passwordResetJwsGenerator = new PasswordResetGeneratorCore(new PasswordResetJwsGenerator(), connection, keyGenerator);
    await passwordResetJwsGenerator.onApplicationBootstrap();
    return passwordResetJwsGenerator;
  },
  inject: [Connection, KeyGenerator],
};

const accessClaimExtractor = {
  provide: ACCESSCLAIMEXTRACTOR,
  useFactory: (connection: Connection) => {
    return new ClaimsExtractorCore(connection, JwtType.ACCESS);
  },
  inject: [Connection],
};


const passwordResetClaimExtractor = {
  provide: PASSWORDCLAIMEXTRACTOR,
  useFactory: (connection: Connection) => {
    return new ClaimsExtractorCore(connection, JwtType.PASSWORD_RESET);
  },
  inject: [Connection],
};

const refreshClaimsExtractor = {
  provide: REFRESHCLAIMEXTRACTOR,
  useFactory: (connection: Connection) => {
    return new ClaimsExtractorCore(connection, JwtType.REFRESH);
  },
  inject: [Connection],
};


@Module({
  imports: [TssSecurityModule],
  providers: [
    RequestMetaDataInterceptor,
    AccessConstrainInterceptor,

    {
      provide: APP_INTERCEPTOR,
      useExisting: RequestMetaDataInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: AccessConstrainInterceptor,
    },
    KeyGeneratorCore,
    keyGenerator,
    accessClaimExtractor,
    passwordResetClaimExtractor,
    refreshClaimsExtractor,
    refreshTokenGenerator,
    accessKeyGenerator,
    passwordResetGenerator,
  ],
  exports: [
    refreshTokenGenerator,
    accessKeyGenerator,
    refreshClaimsExtractor,
    passwordResetClaimExtractor,
    passwordResetGenerator,
  ],

})
export class SecurityModule {
}
