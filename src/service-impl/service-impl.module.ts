import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '@tss/common';
import { PortalUserIdentifierVerificationServiceImpl } from './portal-user-identifier-verification-service.impl';


@Module({
  imports: [
    CommonModule,
    forwardRef(() => ServiceImplModule),
  ],
  providers: [
    PortalUserIdentifierVerificationServiceImpl,
  ],
})
export class ServiceImplModule {
}
