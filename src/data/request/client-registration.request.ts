import { IsEmail, IsNotEmpty } from 'class-validator';
import { EntityValidator } from '@dlabs/common/validators/entity-constraint.validator';
import { Client } from '../../domain/entity/client.entity';

export class ClientRegistrationRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @EntityValidator({
    isExist: false,
    entity: Client,
    column: 'email',
  }, {
    message: 'email has already been used by client',
  })
  email: string;
}
