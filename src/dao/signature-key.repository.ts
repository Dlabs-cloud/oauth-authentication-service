import { BaseRepository } from '@tss/common';
import { SignatureKey } from '../domain/entity/signature-key.entity';
import { EntityRepository } from 'typeorm';
import { JwtType } from '../domain/constants/jwt-type.constant';

@EntityRepository(SignatureKey)
export class SignatureKeyRepository extends BaseRepository<SignatureKey> {


  findByKidAndType(kid: string, type: JwtType) {
    return this.findOne({
      keyId: kid,
      type: type,
    });
  }
}