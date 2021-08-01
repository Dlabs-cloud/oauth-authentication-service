import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Public } from '../security/decorators/public.decorator';
import { Connection } from 'typeorm';
import { SignatureKeyRepository } from '../dao/signature-key.repository';
import { JwtType } from '../domain/constants/jwt-type.constant';
import { JwtWebTokenResponse } from '../data/response/jwt-web-token.response';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';
import { ApiResponseDto } from '../data/response/api.response.dto';

@Controller()
export class SignatureKeyController {


  constructor(private readonly connection: Connection) {
  }

  @Public()
  @Get('/key/:kid')
  public getJsonWebKey(@Param('kid') kid: string): Promise<ApiResponseDto<JwtWebTokenResponse>> {
    return this.connection.getCustomRepository(SignatureKeyRepository)
      .findByKidAndType(kid, JwtType.ACCESS)
      .then(signatureKey => {
        if (!signatureKey) {
          throw  new ErrorResponseException(HttpStatus.NOT_FOUND, 'Kid cannot be found');
        }
        return Promise.resolve(new ApiResponseDto(HttpStatus.OK, new JwtWebTokenResponse(signatureKey)));
      });
  }
}
