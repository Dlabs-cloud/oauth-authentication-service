import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@dlabs/common/utils/typeorm/base.repository';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';


@EntityRepository(PortalUserIdentificationVerification)
export class PortalUserIdentifierVerificationRepository extends BaseRepository<PortalUserIdentificationVerification> {


  findAllActive(identifier: string) {
    return this.createQueryBuilder('portalUserIdentificationVerification')
      .select()
      .where('portalUserIdentificationVerification.identifier = :identifier')
      .andWhere('portalUserIdentificationVerification.usedOn IS NULL')
      .andWhere('portalUserIdentificationVerification.deactivatedOn IS NULL')
      .andWhere('portalUserIdentificationVerification.expiresOn >= CURRENT_TIMESTAMP')
      .setParameter('identifier', identifier)
      .getMany();
  }


}