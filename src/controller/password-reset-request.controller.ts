import { Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { Public } from '../security/decorators/public.decorator';
import { RequestMetaDataContext } from '../security/decorators/request-meta-data.decorator';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { PasswordResetRequestService } from '../service/password-reset-request.service';
import { Connection } from 'typeorm';
import { PortalUserIdentifierRepository } from '../dao/portal-user-identifier.repository';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';
import { PasswordResetEmailSenderService } from '../service/password-reset-email-sender.service';
import { ApiResponseDto } from '../data/response/api.response.dto';


@Controller()
@Public()
export class PasswordResetRequestController {

  constructor(@Inject(PasswordResetRequestService) private readonly passwordResetRequestService: PasswordResetRequestService,
              private readonly connection: Connection,
              @Inject(PasswordResetEmailSenderService) private readonly passwordResetEmailSenderService: PasswordResetEmailSenderService) {
  }

  @Post('/password-resets/:email')
  public requestPasswordResetWithEmail(@Param('email') email: string, @RequestMetaDataContext() requestMetaData: RequestMetaData): Promise<ApiResponseDto<void>> {
    return this.connection.getCustomRepository(PortalUserIdentifierRepository).findByIdentifier(email)
      .then(identifier => {
        if (!identifier) {
          throw new ErrorResponseException(HttpStatus.BAD_REQUEST, 'Identifier is not known');
        }
        return Promise.resolve(identifier);
      })
      .then(identifier => {
        return this.passwordResetRequestService.createRequest(identifier, requestMetaData);
      }).then(passwordResetRequest => {
        return this.passwordResetEmailSenderService.sendResendLink(passwordResetRequest, requestMetaData.host);
      }).then(() => {
        return Promise.resolve(new ApiResponseDto(HttpStatus.NO_CONTENT));
      });

  }
}
