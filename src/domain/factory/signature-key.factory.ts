import { FactoryHelper, ModelFactory } from '@tss/test-starter';
import { SignatureKey } from '../entity/signature-key.entity';
import { UserIdentifierType } from '../constants/user-identifier-type.constant';
import { JwtType } from '../constants/jwt-type.constant';

export class SignatureKeyFactory implements FactoryHelper<SignatureKey> {
  apply(faker: Faker.FakerStatic, modelFactory: ModelFactory): Promise<SignatureKey> {
    const signatureKey = new SignatureKey();
    signatureKey.encodedKey = faker.random.uuid();
    signatureKey.publicKey = faker.random.uuid();
    signatureKey.encodedKey = faker.random.uuid();
    signatureKey.keyId = faker.random.uuid();
    signatureKey.type = faker.random.arrayElement(Object.values(JwtType));
    signatureKey.algorithm = faker.random.alphaNumeric();
    signatureKey.format = faker.random.alphaNumeric();
    return Promise.resolve(signatureKey);
  }

}