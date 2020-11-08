import { Controller, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationCodeParam } from './data/email-verification-code-param';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { PortalUserIdentifierVerificationService } from '../service/portal-user-identifier-verification.service';
import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';
import { Connection } from 'typeorm';

@Controller()
export class PortalUserIdentifierVerificationController {
  constructor(@Inject(PortalUserIdentifierVerificationService) private readonly  portalUserIdentifierVerificationService: PortalUserIdentifierVerificationService,
              private readonly connection: Connection) {
  }

  @Post('/user-emails/:email/verification-code')
  async requestEmailVerificationCode(@Param() verificationCodeParam: EmailVerificationCodeParam) {
    let portalUserIdentifier = await this.connection.getCustomRepository(PortalUserIdentifierRepository).findByIdentifier(verificationCodeParam.email, true);

    if (portalUserIdentifier) {
      throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
    }

    let verification = await this.portalUserIdentifierVerificationService.createVerification(verificationCodeParam.email, UserIdentifierType.EMAIL);
    console.log('We are done');
    return verification;
  }
}