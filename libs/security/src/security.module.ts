import { Module } from '@nestjs/common';
import { HashService } from '@tss/security/service';
import { AsymmetricCrypto } from '@tss/security/service/key-generator';


@Module({
  providers: [HashService, AsymmetricCrypto],
  exports: [HashService, AsymmetricCrypto],
})
export class SecurityModule {
}
