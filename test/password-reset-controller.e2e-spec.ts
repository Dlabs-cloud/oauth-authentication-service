import { INestApplication } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { baseTestingModule } from './test-utils';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';
import { PasswordResetGenerator } from '../src/security/contracts/password-reset-generator.contracts';
import * as faker from 'faker';
import * as request from 'supertest';
import { PasswordResetApiRequest } from '../src/data/request/password-reset-api.request';
import { factory } from '../src/domain/factory/factory';
import { PasswordResetRequest } from '../src/domain/entity/password-reset-request.entity';
import { TokenExpiredError } from 'jsonwebtoken';
import { PASSWORDCLAIMEXTRACTOR } from '../src/security/constants';
import { AccessClaimsExtractor } from '../src/security/contracts/access-claims-extractor.contracts';
import { AccessClaims } from '../src/security/contracts/access-claims.contracts';
import { PortalUserIdentifier } from '../src/domain/entity/portal-user-identifier.entity';

describe('password reset controller e2e', () => {

  let applicationContext: INestApplication;
  let connection: Connection;
  let accessClaimsExtractor: AccessClaimsExtractor;
  beforeAll(async () => {
    const moduleRef: TestingModule = await baseTestingModule().compile();
    applicationContext = moduleRef.createNestApplication();
    applicationContext.useGlobalPipes(new ValidatorTransformerPipe());
    await applicationContext.init();
    connection = getConnection();
    accessClaimsExtractor = moduleRef.get<AccessClaimsExtractor>(PASSWORDCLAIMEXTRACTOR);
  });


  it('Test that a user with valid token and identifier can reset password', () => {
    return factory().upset(PortalUserIdentifier).use(portalUserIdentifier => {
      portalUserIdentifier.identifier = faker.internet.email();
      return portalUserIdentifier;
    }).create().then(portalUserIdentifier => {
      return factory().upset(PasswordResetRequest).use(passwordResetRequest => {
        passwordResetRequest.usedOn = null;
        passwordResetRequest.expiresOn = faker.date.future();
        passwordResetRequest.deactivatedOn = null;
        passwordResetRequest.portalUserIdentifier = portalUserIdentifier;
        return passwordResetRequest;
      }).create().then(passwordResetRequest => {
        const url = `/password/${passwordResetRequest.portalUserIdentifier.identifier}/${faker.random.uuid()}`;
        return Promise.resolve({ url, passwordResetRequest });
      }).then(urlRequest => {
        const accessClams = {
          getId(): string {
            return urlRequest.passwordResetRequest.id.toString();
          }, getSubject(): string {
            return urlRequest.passwordResetRequest.portalUser.id.toString();
          },
        } as AccessClaims;
        let spyInstance = jest.spyOn(accessClaimsExtractor, 'getClaims').mockResolvedValueOnce(accessClams);
        return request(applicationContext.getHttpServer())
          .post(urlRequest.url)
          .send({
            invalidateOtherSession: true,
            password: '234012345',
          })
          .expect(201);
      });
    });
  });
  it('Test that an invalid token with valid identifier cannot perform password reset', () => {

    const url = `/password/${faker.internet.email}/${faker.random.uuid()}`;
    const payload: PasswordResetApiRequest = {
      invalidateOtherSession: true,
      password: '234012345',
    };
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(payload)
      .expect(403)
      .then(response => {
        expect(response.body.message).toEqual('Token is not valid');
      });
  });


  it('Test that a valid token and invalid identifier cannot perform  password reset action', () => {
    return factory().upset(PortalUserIdentifier).use(portalUserIdentifier => {
      portalUserIdentifier.identifier = faker.internet.email();
      return portalUserIdentifier;
    }).create().then(portalUserIdentifier => {
      return factory().upset(PasswordResetRequest).use(passwordResetRequest => {
        passwordResetRequest.usedOn = null;
        passwordResetRequest.expiresOn = faker.date.future();
        passwordResetRequest.deactivatedOn = null;
        passwordResetRequest.portalUserIdentifier = portalUserIdentifier;
        return passwordResetRequest;
      }).create().then(passwordResetRequest => {
        const url = `/password/${faker.internet.email()}/${faker.random.uuid()}`;
        return Promise.resolve({ url, passwordResetRequest });
      }).then(urlRequest => {
        const accessClams = {
          getId(): string {
            return urlRequest.passwordResetRequest.id.toString();
          }, getSubject(): string {
            return urlRequest.passwordResetRequest.portalUser.id.toString();
          },
        } as AccessClaims;
        let spyInstance = jest.spyOn(accessClaimsExtractor, 'getClaims').mockResolvedValueOnce(accessClams);
        return request(applicationContext.getHttpServer())
          .post(urlRequest.url)
          .send({
            invalidateOtherSession: true,
            password: '234012345',
          })
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Identifier does not match with token');
            spyInstance.mockRestore();
          });
      });
    });
  });


  it('Test that a used token cannot be reused', () => {
    return factory().upset(PasswordResetRequest).use(passwordResetGenerator => {
      passwordResetGenerator.usedOn = faker.date.past();
      return passwordResetGenerator;
    }).create().then(passwordResetRequest => {
      const url = `/password/${passwordResetRequest.portalUserIdentifier.identifier}/${faker.random.uuid()}`;
      return Promise.resolve({ url, passwordResetRequest });
    }).then(urlRequest => {
      const accessClams = {
        getId(): string {
          return urlRequest.passwordResetRequest.id.toString();
        }, getSubject(): string {
          return urlRequest.passwordResetRequest.portalUser.id.toString();
        },
      } as AccessClaims;
      let spyInstance = jest.spyOn(accessClaimsExtractor, 'getClaims').mockResolvedValueOnce(accessClams);
      return request(applicationContext.getHttpServer())
        .post(urlRequest.url)
        .send({
          invalidateOtherSession: true,
          password: '234012345',
        })
        .expect(403)
        .then(response => {
          expect(response.body.message).toEqual('Token has already been used');
          spyInstance.mockRestore();
        });
    });
  });


  it('Test that an expired token cannot do perform reset', () => {
    let spyInstance = jest.spyOn(accessClaimsExtractor, 'getClaims').mockImplementation(() => {
      throw new TokenExpiredError('Token expired', faker.date.past());
    });
    const url = `/password/${faker.internet.email}/${faker.random.uuid()}`;
    const payload: PasswordResetApiRequest = {
      invalidateOtherSession: true,
      password: '234012345',
    };
    return request(applicationContext.getHttpServer())
      .post(url)
      .send(payload)
      .expect(403)
      .then(response => {
        expect(response.body.message).toEqual('Reset token is expired');
        spyInstance.mockRestore();
      });
  });

  afterAll(async () => {
    await connection.close();
    await applicationContext.close();
  });
});
