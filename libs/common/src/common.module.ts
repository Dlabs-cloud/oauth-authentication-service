import { Module } from '@nestjs/common';
import { PhoneNumberService } from '@tss/common/utils/phone-number/phone-number.service';

@Module({
  providers: [PhoneNumberService],
  exports: [PhoneNumberService],
})
export class CommonModule {
}
