import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerModule } from './controller/controller.module';
import { ConfModule } from './conf/conf.module';
import { DaoModule } from './dao/dao.module';
import { DomainModule } from './domain/domain.module';
import { ServiceModule } from './service/service.module';
import { ServiceImplModule } from './service-impl/service-impl.module';
import { CoreModule } from './core/core.module';
import { TssCommonModule } from './tss-common/tss-common.module';

@Module({
  imports: [
    ControllerModule,
    ConfModule,
    DaoModule,
    DomainModule,
    ServiceModule,
    ServiceImplModule,
    CoreModule,
    TssCommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
