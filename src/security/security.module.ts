import { Module } from '@nestjs/common';
import { RequestMetaDataInterceptor } from './interceptors/request-meta-data.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthJwsGenerator } from './core/auth-jwt-generator.core';
import { RefreshTokenGeneratorCore } from './core/refresh-token-generator.core';
import { AccessTokenGeneratorCore } from './core/access-token-generator.core';
import { ACCESSCLAIMEXTRACTOR, ACCESSKEYGENERATOR, REFRESHCLAIMEXTRACTOR, REFRESHKEYGENERATOR } from './constants';
import { Connection } from 'typeorm';
import { KeyGenerator } from './contracts/key-generator.contracts';
import { KeyGeneratorCore } from './core/key-generator.core';
import { SecurityModule as TssSecurityModule } from '@tss/security';
import { AccessClaimsExtractorCore } from './core/access-claims-extractor.core';
import { RefreshClaimsExtractorCore } from './core/refresh-claims-extractor.core';

const refreshTokenGenerator = {
  provide: REFRESHKEYGENERATOR,
  useFactory: async (connection: Connection, keyGenerator: KeyGenerator) => {
    let refreshTokenGeneratorCore = new RefreshTokenGeneratorCore(new AuthJwsGenerator(), connection, keyGenerator);
    await refreshTokenGeneratorCore.onApplicationBootstrap();
    return refreshTokenGeneratorCore;
  },
  inject: [Connection, KeyGenerator],
};

const accessClaimExtractor = {
  provide: ACCESSCLAIMEXTRACTOR,
  useExisting: AccessClaimsExtractorCore,
};

const refreshClaimsExtractor = {
  provide: REFRESHCLAIMEXTRACTOR,
  useExisting: RefreshClaimsExtractorCore,
};

const accessKeyGeneratorCore = {
  provide: ACCESSKEYGENERATOR,
  useFactory: async (connection: Connection, keyGenerator: KeyGenerator) => {
    let accessTokenGeneratorCore = new AccessTokenGeneratorCore(new AuthJwsGenerator(), connection, keyGenerator);
    await accessTokenGeneratorCore.onApplicationBootstrap();
    return accessTokenGeneratorCore;
  },
  inject: [Connection, KeyGenerator],
};


const keyGenerator = {
  provide: KeyGenerator,
  useExisting: KeyGeneratorCore,

};

@Module({
  imports: [TssSecurityModule],
  providers: [
    RequestMetaDataInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useExisting: RequestMetaDataInterceptor,
    },
    KeyGeneratorCore,
    keyGenerator,
    accessClaimExtractor,
    refreshClaimsExtractor,
    refreshTokenGenerator,
    accessKeyGeneratorCore,
    AccessClaimsExtractorCore,
    RefreshClaimsExtractorCore,
  ],
  exports: [
    refreshTokenGenerator,
    accessKeyGeneratorCore,
    refreshClaimsExtractor,
  ],

})
export class SecurityModule {
}
