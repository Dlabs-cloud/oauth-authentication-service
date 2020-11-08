import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '@tss/common';
import { PortalUserIdentifierVerificationServiceImpl } from './portal-user-identifier-verification-service.impl';
import { SecurityModule } from '@tss/security';
import { ServiceModule } from '../service/service.module';
import { ConfModule } from '../conf/conf.module';


@Module({
  imports: [
    CommonModule,
    forwardRef(() => ServiceModule),
    SecurityModule,
    ConfModule,
  ],
  providers: [
    PortalUserIdentifierVerificationServiceImpl,
  ],
  exports: [
    PortalUserIdentifierVerificationServiceImpl,
  ],
})
export class ServiceImplModule {
}
