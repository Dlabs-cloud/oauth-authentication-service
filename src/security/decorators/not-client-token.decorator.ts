import { SetMetadata } from '@nestjs/common';
import { AccessTypes } from '../enums/enum';

export const NotClientToken = () => SetMetadata(AccessTypes.NOTCLIENTTOKEN, AccessTypes.NOTCLIENTTOKEN);
