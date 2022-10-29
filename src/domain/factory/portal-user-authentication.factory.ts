import { FactoryHelper, ModelFactory } from '@dlabs/test-starter';
import { PortalUserAuthentication } from '../entity/portal-user-authentication.entity';
import { PortalUser } from '../entity/portal-user.entity';
import { AuthenticationResponseType } from '../constants/authentication-response-type,constant';
import { AuthenticationType } from '../constants/authentication-type.constant';
import { PortalUserIdentifier } from '../entity/portal-user-identifier.entity';


export class PortalUserAuthenticationFactory implements FactoryHelper<PortalUserAuthentication> {
  async apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<PortalUserAuthentication> {
    let portalUserAuthentication = new PortalUserAuthentication();
    portalUserAuthentication.autoLogoutAt = faker.date.future();
    portalUserAuthentication.becomesInactiveAt = faker.date.future();
    portalUserAuthentication.lastActiveAt = faker.date.future();
    portalUserAuthentication.portalUser = await modelFactory.create(PortalUser);
    portalUserAuthentication.userAgent = faker.internet.userAgent();
    portalUserAuthentication.ipAddress = faker.internet.ip();
    portalUserAuthentication.responseType = faker.random.arrayElement(Object.values(AuthenticationResponseType));
    portalUserAuthentication.type = faker.random.arrayElement(Object.values(AuthenticationType));
    portalUserAuthentication.deactivatedAt = faker.date.future();
    portalUserAuthentication.identifier = faker.internet.email();
    portalUserAuthentication.loggedOutAt = faker.date.future();
    portalUserAuthentication.portalUserIdentifier = await modelFactory.create(PortalUserIdentifier);
    return portalUserAuthentication;

  }

}