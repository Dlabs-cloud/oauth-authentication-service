import { SetMetadata } from '@nestjs/common';
import { AccessTypes } from '../enums/enum';

export const AccessTokenRequest = () => SetMetadata(AccessTypes.ACCESS_TOKEN_REQUEST, AccessTypes.ACCESS_TOKEN_REQUEST);
