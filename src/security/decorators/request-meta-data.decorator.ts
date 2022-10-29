import { createParamDecorator } from '@nestjs/common';
import { IllegalArgumentException } from '@dlabs/common';


export const RequestMetaDataContext = createParamDecorator((data, context) => {
  const requestMetaData = context.switchToHttp().getRequest().metadata;
  if (!requestMetaData) {
    throw new IllegalArgumentException();
  }
  return requestMetaData;
});
