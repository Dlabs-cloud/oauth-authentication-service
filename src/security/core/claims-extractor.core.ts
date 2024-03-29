import { AccessClaimsExtractor } from '../contracts/access-claims-extractor.contracts';
import { Connection } from 'typeorm';
import { AccessClaims } from '../contracts/access-claims.contracts';
import { decode, TokenExpiredError, verify, VerifyErrors } from 'jsonwebtoken';
import { SignatureKeyRepository } from '../../dao/signature-key.repository';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SimpleAccessClaimsCore } from './simple-access-claims.core';
import { JwtTokenPayloadDto } from '@dlabs/security/../../../libs/common/src/security/data/jwt-token-payload.dto';
import { SignatureKey } from '../../domain/entity/signature-key.entity';


export class ClaimsExtractorCore implements AccessClaimsExtractor {
  constructor(private readonly connection: Connection, private readonly type: JwtType) {
  }

  async getClaims(jws: string): Promise<AccessClaims> {
    try {
      const decodedToken = decode(jws, { complete: true });
      if (!decodedToken) {
        return null;
      }

      // @ts-ignore
      const header = decodedToken.header;
      if (!header.kid) {
        return null;
      }

      const signatureKey = await this.connection
        .getCustomRepository(SignatureKeyRepository)
        .findByKidAndType(header.kid, this.type);

      if (!signatureKey) {
        return null;
      }
      const claims = await this.verifyToken(jws, signatureKey);
      return new SimpleAccessClaimsCore(claims as JwtTokenPayloadDto);

    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw e;
      }
      return null;
    }
  }

  private verifyToken(jws: string, signatureKey: SignatureKey) {
    const publicKey = Buffer.from(signatureKey.encodedKey, 'base64').toString();
    return new Promise((resolve, reject) => {
      verify(jws, publicKey, (err: VerifyErrors, decoded: object | string) => {
        if (err) {
          if (err instanceof SyntaxError) {
            reject('Token is invalid');
          } else {
            reject(err);
          }
        }
        if (decoded) {
          resolve(decoded);
        }
        reject(null);
      });
    });
  }
}
