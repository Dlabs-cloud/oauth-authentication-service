// tslint:disable-next-line:variable-name
import { SetMetadata } from '@nestjs/common';
import { AccessTypes } from '../enums/enum';

export const Public = () => SetMetadata(AccessTypes.PUBLIC, AccessTypes.PUBLIC);
