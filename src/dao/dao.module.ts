import { Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationRepository } from './portal-user-identifier-verification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortalUserIdentifierRepository } from './portal-user-identifier.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PortalUserIdentifierVerificationRepository,
      PortalUserIdentifierRepository,
    ]),
  ],
  providers: [],
})
export class DaoModule {
}
