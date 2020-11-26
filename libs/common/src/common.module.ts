import { Module } from '@nestjs/common';
import { PhoneNumberService } from '@tss/common/utils/phone-number/phone-number.service';
import { AsymmetricCrypto, HashService } from '@tss/common/security';


@Module({
  providers: [PhoneNumberService, HashService, AsymmetricCrypto],
  exports: [PhoneNumberService, HashService, AsymmetricCrypto],
})
export class CommonModule {
}
