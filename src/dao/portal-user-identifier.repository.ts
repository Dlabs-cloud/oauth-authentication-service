import { BaseRepository } from '@tss/common';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { EntityRepository } from 'typeorm';
import { PortalUser } from '../domain/entity/portal-user.entity';

@EntityRepository(PortalUserIdentifier)
export class PortalUserIdentifierRepository extends BaseRepository<PortalUserIdentifier> {


  findByIdentifier(identifier: string, isVerified: boolean) {
    return this.findOneItemByStatus({
      identifier: identifier,
      verified: isVerified,
    });


  }

  findByPortalUser(portalUser: PortalUser) {
    return this.createQueryBuilder('portalUserIdentifier').select()
      .where('portalUserIdentifier.portalUserId = :portalUserId')
      .setParameter('portalUserId', portalUser.id)
      .getMany();
  }
}