import { EntityRepository, Repository } from 'typeorm';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { BaseRepository } from '@tss/common/utils/typeorm/base.repository';
import { GenericStatus } from '@tss/common/constants/generic-status.constant';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';


@EntityRepository(PortalUserIdentificationVerification)
export class PortalUserIdentifierVerificationRepository extends BaseRepository<PortalUserIdentificationVerification> {


  findAllActive(identifier: string) {
    return this.createQueryBuilder()
      .where('identifier = :identifier')
      .andWhere('usedOn = IS NULL')
      .andWhere('deactivatedOn = IS NULL')
      .andWhere('expiresOn >= CURRENT_TIMESTAMP')
      .setParameter('identifier', identifier)
      .getMany();
  }
}