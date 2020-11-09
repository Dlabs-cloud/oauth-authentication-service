import { Module } from '@nestjs/common';
import { UserIdentifierVerificationHandler } from './user-identifier-verification.handler';

@Module({
  providers: [
    UserIdentifierVerificationHandler,
  ],
})
export class EventHandlersModule {
}
