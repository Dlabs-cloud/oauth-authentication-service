import { Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationCodeParam } from './data/email-verification-code-param';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';

@Controller()
export class PortalUserIdentifierVerificationController {
  constructor(private readonly portalUserIdentifierVerificationService: PortalUserIdentifierVerificationService,
              @InjectRepository(PortalUserIdentifierRepository)
              private readonly portalUserIdentifierRepository: PortalUserIdentifierRepository) {
  }

  @Post('/user-emails/:email/verification-code')
  async requestEmailVerificationCode(@Param('email') verificationCodeParam: EmailVerificationCodeParam) {
    let portalUserIdentifier = await this.portalUserIdentifierRepository
      .findBuIdentifier(verificationCodeParam.email, true);
    if (portalUserIdentifier) {
      throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
    }

    let verification = await this.portalUserIdentifierVerificationService.createVerification(verificationCodeParam.email, UserIdentifierType.EMAIL);
    return verification;
  }
}