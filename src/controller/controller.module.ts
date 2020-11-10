import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { DaoModule } from '../dao/dao.module';
import { PortalUserIdentifierVerificationController } from './portal-user-identifier-verification.controller';
import {
  ResponseTransformInterceptor,
  responseTransformInterceptor,
} from '@tss/common/interceptors/response-transform.interceptor';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
  ],
  controllers: [
    PortalUserIdentifierVerificationController,
  ],
  providers: [
    ResponseTransformInterceptor,
    responseTransformInterceptor,
  ],
})
export class ControllerModule {
}
