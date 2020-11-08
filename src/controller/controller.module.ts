import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { DaoModule } from '../dao/dao.module';
import { PortalUserIdentifierVerificationController } from './portal-user-identifier-verification.controller';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
  ],
  controllers: [
    PortalUserIdentifierVerificationController,
  ],
})
export class ControllerModule {
}
