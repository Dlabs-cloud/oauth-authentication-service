import { Controller, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { EmailVerificationCodeParam } from '../data/params/email-verification-code.param';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { Connection } from 'typeorm';
import { ApiResponseDto } from '@tss/common/data/api.response.dto';
import { VerificationEmailSenderService } from '../service/verification-email-sender.service';
import { Public } from '../security/decorators/public.decorator';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller()
@Public()
export class PortalUserIdentifierVerificationController {
  constructor(@Inject(PortalUserIdentifierVerificationService)
              private readonly  portalUserIdentifierVerificationService: PortalUserIdentifierVerificationService,
              @Inject(VerificationEmailSenderService)
              private readonly verificationEmailSenderService: VerificationEmailSenderService,
              private readonly connection: Connection) {
  }

  @Post('/user-emails/:email/verification-code')
  @ApiNoContentResponse()
  async requestEmailVerificationCode(@Param() verificationCodeParam: EmailVerificationCodeParam) {
    let portalUserIdentifier = await this.connection
      .getCustomRepository(PortalUserIdentifierRepository)
      .findByIdentifier(verificationCodeParam.email);

    if (portalUserIdentifier) {
      throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
    }

    return this.portalUserIdentifierVerificationService
      .createVerification(verificationCodeParam.email, UserIdentifierType.EMAIL)
      .then(verification => {
        return this.verificationEmailSenderService.sendVerificationCode(verification.userVerification)
          .then(() => {
            return Promise.resolve(new ApiResponseDto(HttpStatus.NO_CONTENT));
          });
      });

  }
}