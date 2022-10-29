import { FactoryHelper, ModelFactory } from '@dlabs/test-starter';
import { RefreshToken } from '../entity/refresh-token.entity';
import { PortalUser } from '../entity/portal-user.entity';
import { PortalUserAuthentication } from '../entity/portal-user-authentication.entity';

export class RefreshTokenFactory implements FactoryHelper<RefreshToken> {
  async apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<RefreshToken> {
    let refreshToken = new RefreshToken();
    refreshToken.expiresAt = faker.date.future();
    refreshToken.accessExpiresAt = faker.date.future();
    refreshToken.portalUser = await modelFactory.create(PortalUser);
    refreshToken.actualAuthentication = await modelFactory.create(PortalUserAuthentication);
    refreshToken.timeDeactivated = faker.date.future();
    return refreshToken;
  }

}