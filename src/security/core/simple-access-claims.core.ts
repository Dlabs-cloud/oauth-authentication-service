;
import { AccessClaims } from '../contracts/access-claims.contracts';
import { JwtTokenPayloadDto } from '@tss/security/data/jwt-token-payload.dto';


export class SimpleAccessClaimsCore implements AccessClaims {


  constructor(private readonly claims: JwtTokenPayloadDto) {
  }


  getExpirationTime(): Date {
    return new Date(this.claims.exp);

  }

  getId(): string {
    return this.claims.jti;
  }

  getIssuer(): string {
    return this.claims.iss;
  }

  getStartTime(): Date {
    return new Date(this.claims.nbf);
  }

  getSubject(): string {
    return this.claims.sub;
  }

  getTimeIssued(): Date {
    return new Date(this.claims.iat);
  }

  getKid(): string {
    return this.claims.kid;
  }

}