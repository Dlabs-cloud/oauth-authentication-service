import { Controller, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { Connection } from 'typeorm';
import { ApiResponseDto } from '../data/response/api.response.dto';
import { VerificationEmailSenderService } from '../service/verification-email-sender.service';
import { Public } from '../security/decorators/public.decorator';

@Controller()
@Public()
export class PortalUserIdentifierVerificationController {
  constructor(@Inject(PortalUserIdentifierVerificationService)
              private readonly  portalUserIdentifierVerificationService: PortalUserIdentifierVerificationService,
              @Inject(VerificationEmailSenderService)
              private readonly verificationEmailSenderService: VerificationEmailSenderService,
              private readonly connection: Connection) {
  }

  @Post('user-emails/:email/verification-code')
  async requestEmailVerificationCode(@Param('email')email: string): Promise<ApiResponseDto<void>> {
    const portalUserIdentifier = await this.connection
      .getCustomRepository(PortalUserIdentifierRepository)
      .findByIdentifier(email);

    if (portalUserIdentifier) {
      throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
    }

    return this.portalUserIdentifierVerificationService
      .createVerification(email, UserIdentifierType.EMAIL)
      .then(verification => {
        return this.verificationEmailSenderService.sendVerificationCode(verification.userVerification)
          .then(() => {
            return Promise.resolve(new ApiResponseDto(HttpStatus.NO_CONTENT));
          });
      });

  }
}
