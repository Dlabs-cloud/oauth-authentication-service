import { AccessClaimsExtractor } from '../contracts/access-claims-extractor.contracts';
import { AccessClaims } from '../contracts/access-claims.contracts';
import { decode, verify, VerifyErrors } from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { SignatureKeyRepository } from '../../dao/signature-key.repository';
import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { SimpleAccessClaimsCore } from './simple-access-claims.core';
import { JwtTokenPayloadDto } from '@tss/security/data/jwt-token-payload.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AccessClaimsExtractorCore implements AccessClaimsExtractor {
  constructor(private readonly connection: Connection) {
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
      let signatureKey = await this.connection.getCustomRepository(SignatureKeyRepository).findByKidAndType(header.kid, JwtType.ACCESS);
      if (!signatureKey) {
        return null;
      }
      let claims = await this.verifyToken(jws, signatureKey);
      console.log(claims);
      return new SimpleAccessClaimsCore(claims as JwtTokenPayloadDto);

    } catch (e) {
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