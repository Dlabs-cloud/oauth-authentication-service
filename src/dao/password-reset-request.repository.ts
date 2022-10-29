import { BaseRepository } from '@dlabs/common';
import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { EntityRepository } from 'typeorm';
import { PortalUserIdentifier } from '../domain/entity/portal-user-identifier.entity';
import { PortalUser } from '../domain/entity/portal-user.entity';

@EntityRepository(PasswordResetRequest)
export class PasswordResetRequestRepository extends BaseRepository<PasswordResetRequest> {

  findAllActive(identifier: string) {
    return this.createQueryBuilder('passwordResetRequest')
      .select()
      .innerJoin(PortalUserIdentifier, 'portalUserIdentifier', 'portalUserIdentifier.id = passwordResetRequest.portalUserIdentifierId ')
      .where('portalUserIdentifier.identifier = :identifier')
      .andWhere('passwordResetRequest.usedOn IS NULL')
      .andWhere('passwordResetRequest.deactivatedOn IS NULL')
      .andWhere('passwordResetRequest.expiresOn >= CURRENT_TIMESTAMP')
      .setParameter('identifier', identifier)
      .getMany();
  }


  findByPortalUser(portalUser: PortalUser) {
    return this.createQueryBuilder('passwordResetRequest')
      .select()
      .innerJoin(PortalUser, 'portalUser', 'portalUser.id = passwordResetRequest.portalUserId ')
      .where('portalUser.id = :portalUserId')
      .andWhere('passwordResetRequest.usedOn IS NULL')
      .andWhere('passwordResetRequest.deactivatedOn IS NULL')
      .andWhere('passwordResetRequest.expiresOn >= CURRENT_TIMESTAMP')
      .setParameter('portalUserId', portalUser.id)
      .getMany();
  }

}
