import { BaseRepository } from '@tss/common';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(PortalUserIdentifier)
export class PortalUserIdentifierRepository extends BaseRepository<PortalUserIdentifier> {


  findByIdentifier(identifier: string, isVerified: boolean) {
    return this.findOneItemByStatus({
      identifier: identifier,
      verified: isVerified,
    });
  }
}