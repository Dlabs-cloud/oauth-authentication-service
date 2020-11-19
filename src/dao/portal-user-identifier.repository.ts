import { BaseRepository } from '@tss/common';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { EntityRepository } from 'typeorm';
import { PortalUser } from '../domain/entity/portal-user.entity';

@EntityRepository(PortalUserIdentifier)
export class PortalUserIdentifierRepository extends BaseRepository<PortalUserIdentifier> {


  findByIdentifier(identifier: string) {
    return this.findOneItemByStatus({
      identifier: identifier.toLowerCase(),
    });


  }

  findByPortalUser(portalUser: PortalUser) {
    return this.createQueryBuilder('portalUserIdentifier').select()
      .where('portalUserIdentifier.portalUserId = :portalUserId')
      .setParameter('portalUserId', portalUser.id)
      .getMany();
  }
}