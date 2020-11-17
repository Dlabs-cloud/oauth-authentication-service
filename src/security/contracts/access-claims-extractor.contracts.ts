import { AccessClaims } from './access-claims.contracts';

export interface AccessClaimsExtractor {
  getClaims(jws: string): Promise<AccessClaims>
}

