import { AccessClaimsExtractor } from '../contracts/access-claims-extractor.contracts';
import { Connection } from 'typeorm';
import { AccessClaims } from '../contracts/access-claims.contracts';
import { decode, TokenExpiredError, verify, VerifyErrors } from 'jsonwebtoken';
import { SignatureKeyRepository } from '../../dao/signature-key.repository';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SimpleAccessClaimsCore } from './simple-access-claims.core';
import { JwtTokenPayloadDto } from '@tss/security/data/jwt-token-payload.dto';
import { SignatureKey } from '../../domain/entity/signature-key.entity';


export class ClaimsExtractorCore implements AccessClaimsExtractor {
  constructor(private readonly connection: Connection, private readonly type: JwtType) {
  }

  async getClaims(jws: string): Promise<AccessClaims> {
    try {


      let decodedToken = decode(jws, { complete: true });
      if (!decodedToken) {
        return null;
      }

      // @ts-ignore
      let header = decodedToken.header;
      if (!header.kid) {
        return null;
      }

      let signatureKey = await this.connection
        .getCustomRepository(SignatureKeyRepository)
        .findByKidAndType(header.kid, this.type);

      if (!signatureKey) {
        return null;
      }
      let claims = await this.verifyToken(jws, signatureKey);
      return new SimpleAccessClaimsCore(claims as JwtTokenPayloadDto);

    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw e;
      }
      return null;
    }
  }

  private verifyToken(jws: string, signatureKey: SignatureKey) {
    return new Promise((resolve, reject) => {
      verify(jws, signatureKey.encodedKey, (err: VerifyErrors, decoded: object | string) => {
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