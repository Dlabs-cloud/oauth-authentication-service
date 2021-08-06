import { SetMetadata } from '@nestjs/common';
import { AccessTypes } from '../enums/enum';

export const Public = () => SetMetadata(AccessTypes.CLIENT_REQUEST, AccessTypes.CLIENT_REQUEST);
