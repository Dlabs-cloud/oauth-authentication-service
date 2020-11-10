import { Controller, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationCodeParam } from './data/email-verification-code-param';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { Connection } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { UserIdentifierVerificationEvent } from '../events/user-identifier-verification.event';
import { ApiResponseDto } from '@tss/common/data/api.response.dto';
import { VerificationEmailSenderService } from '../service/verification-email-sender.service';

@Controller()
export class PortalUserIdentifierVerificationController {
  constructor(@Inject(PortalUserIdentifierVerificationService)
              private readonly  portalUserIdentifierVerificationService: PortalUserIdentifierVerificationService,
              @Inject(VerificationEmailSenderService)
              private readonly verificationEmailSenderService: VerificationEmailSenderService,
              private readonly connection: Connection) {
  }

  @Post('/user-emails/:email/verification-code')
  async requestEmailVerificationCode(@Param() verificationCodeParam: EmailVerificationCodeParam) {
    let portalUserIdentifier = await this.connection.getCustomRepository(PortalUserIdentifierRepository).findByIdentifier(verificationCodeParam.email, true);

    if (portalUserIdentifier) {
      throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
    }

    return this.portalUserIdentifierVerificationService
      .createVerification(verificationCodeParam.email, UserIdentifierType.EMAIL)
      .then(verification => {
        return this.verificationEmailSenderService.sendVerificationCode(verification.userVerification)
          .then(res => {
            return Promise.resolve(new ApiResponseDto(201));
          });
      });

  }
}