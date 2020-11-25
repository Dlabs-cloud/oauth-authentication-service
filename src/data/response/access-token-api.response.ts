import { Gender } from '../../domain/constants/gender.constant';
import { PortalUser } from '../../domain/entity/portal-user.entity';


export class AccessTokenApiResponse {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  emailAddresses: string[];
  phoneNumbers: string[];
  data: { name, value };
  passwordUpdateRequired: boolean;
  refresh_token: string;
  token_type: string = 'Bearer';
  access_token: string;
  secondsTillExpiry: number;
  expires_at: Date;

  constructor(user: PortalUser) {
    this.displayName = user.displayName;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.gender = user.gender;
    this.id = user.id;
    this.passwordUpdateRequired = user.passwordUpdateRequired;
  }
}