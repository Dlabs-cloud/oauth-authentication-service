import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { DaoModule } from '../dao/dao.module';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
  ],
})
export class ControllerModule {
}
