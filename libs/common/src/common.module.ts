import { Module } from '@nestjs/common';
import { PhoneNumberService } from '@dlabs/common/utils/phone-number/phone-number.service';
import { AsymmetricCrypto, HashService } from '@dlabs/common/security';


@Module({
  providers: [PhoneNumberService, HashService, AsymmetricCrypto],
  exports: [PhoneNumberService, HashService, AsymmetricCrypto],
})
export class CommonModule {
}
