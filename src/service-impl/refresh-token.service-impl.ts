import { RefreshTokenService } from '../service/refresh-token.service';
import { PortalUserAuthentication } from '../domain/entity/portal-user-authentication.entity';
import { RefreshToken } from '../domain/entity/refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { SettingsRepository } from '../dao/settings.repository';
import { DateTime } from 'luxon';

@Injectable()
export class RefreshTokenServiceImpl implements RefreshTokenService {
  public static REFRESH_TOKEN_EXPIRY_DURATION_IN_MINUTES = 'REFRESH_TOKEN_EXPIRY_DURATION_IN_MINUTES';
  public static ACCESS_TOKEN_EXPIRY_DURATION_IN_SECONDS = 'ACCESS_TOKEN_EXPIRY_DURATION_IN_SECONDS';
  private static REFRESH_TOKEN_EXPIRY_DURATION_IN_MINUTES_VALUE = 60 * 24;
  private static ACCESS_TOKEN_EXPIRY_DURATION_IN_SECONDS_VALUE = 180;

  constructor(private readonly connection: Connection) {
  }

  async createRefreshToken(entityManager: EntityManager, portalUserAuthentication: PortalUserAuthentication): Promise<RefreshToken> {
    let refreshToken = new RefreshToken();
    refreshToken.portalUser = portalUserAuthentication.portalUser;
    refreshToken.expiresAt = await this.getExpiryDate();
    refreshToken.accessExpiresAt = await this.getAccessExpiresAt();
    refreshToken.actualAuthentication = portalUserAuthentication;
    return entityManager.save(refreshToken).then(refreshToken => {
      portalUserAuthentication.lastActiveAt = refreshToken.createdAt;
      portalUserAuthentication.becomesInactiveAt = refreshToken.accessExpiresAt;
      portalUserAuthentication.autoLogoutAt = refreshToken.expiresAt;
      return entityManager.save(portalUserAuthentication).then(portalUserAuthentication => {
        return Promise.resolve(refreshToken);
      });

    });

  }

  private getExpiryDate() {
    return this.connection
      .getCustomRepository(SettingsRepository)
      .findByLabel(RefreshTokenServiceImpl.REFRESH_TOKEN_EXPIRY_DURATION_IN_MINUTES, RefreshTokenServiceImpl.REFRESH_TOKEN_EXPIRY_DURATION_IN_MINUTES_VALUE)
      .then(setting => {
        let dateTime = DateTime.local().plus({
          minute: Number(setting.value),
        });
        return Promise.resolve(dateTime.toJSDate());
      });

  }

  private getAccessExpiresAt() {
    return this.connection
      .getCustomRepository(SettingsRepository)
      .findByLabel(RefreshTokenServiceImpl.ACCESS_TOKEN_EXPIRY_DURATION_IN_SECONDS, RefreshTokenServiceImpl.ACCESS_TOKEN_EXPIRY_DURATION_IN_SECONDS_VALUE)
      .then(setting => {
        let dateTime = DateTime.local().plus({
          second: Number(setting.value),
        });
        return Promise.resolve(dateTime.toJSDate());
      });
  }

  deactivateRefreshToken(refreshToken: RefreshToken) {
  }

}