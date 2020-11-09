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
import { ExceptionsModule } from './exceptions/exceptions.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from '@tss/security';
import { EventsModule } from './events/events.module';
import { EventHandlersModule } from './event-handlers/event-handlers.module';

@Module({
  imports: [
    ControllerModule,
    ConfModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ConfModule.environment + '.env'],
    }),
    DaoModule,
    DomainModule,
    ServiceModule,
    ServiceImplModule,
    CoreModule,
    ExceptionsModule,
    EventsModule,
    EventHandlersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
