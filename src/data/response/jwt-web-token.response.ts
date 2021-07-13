import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { pem2jwk } from 'pem-jwk';

export class JwtWebTokenResponse {
  private static SIGNATURE_USE = 'sig';
  kid: string;
  use: string = JwtWebTokenResponse.SIGNATURE_USE;
  kty: string;
  modulus: string;
  exponent: string;


  constructor(signatureKey: SignatureKey) {
    this.kid = signatureKey.keyId;
    const publicKey = Buffer.from(signatureKey.encodedKey, 'base64').toString();
    let rsajwk = pem2jwk(publicKey);
    this.kty = rsajwk.kty;
    this.exponent = rsajwk.e;
    this.modulus = rsajwk.n;
  }


}