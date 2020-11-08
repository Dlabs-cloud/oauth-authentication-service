import { PortalUserIdentifierVerificationService } from './portal-user-identifier-verification.service';
import { forwardRef, Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationServiceImpl } from '../service-impl/portal-user-identifier-verification-service.impl';
import { ServiceImplModule } from '../service-impl/service-impl.module';

let portalUserIdentifierService = {
  provide: PortalUserIdentifierVerificationService,
  useExisting: PortalUserIdentifierVerificationServiceImpl,
};


@Module({
  imports: [
    forwardRef(() => ServiceImplModule),
  ],
  providers: [
    portalUserIdentifierService,
  ],
  exports: [
    portalUserIdentifierService,
  ],
})
export class ServiceModule {
}
