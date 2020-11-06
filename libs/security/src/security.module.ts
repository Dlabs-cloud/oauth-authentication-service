import { Module } from '@nestjs/common';
import { HashService } from '@tss/security/service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class SecurityModule {
}
