import { AccessClaims } from '../contracts/access-claims.contracts';

export class RequestMetaData {

  private _ipAddress: string;
  private _userAgent: string;
  private _accessToken: string;
  private _localHost: boolean;
  private _accessClaims?: AccessClaims;
  private _tokenExpired: boolean;
  private portalUser?: number;


  get tokenExpired(): boolean {
    return this._tokenExpired;
  }

  set tokenExpired(value: boolean) {
    this._tokenExpired = value;
  }


  get ipAddress(): string {
    return this._ipAddress;
  }

  set ipAddress(value: string) {
    this._ipAddress = value;
  }

  get userAgent(): string {
    return this._userAgent;
  }

  set userAgent(value: string) {
    this._userAgent = value;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
  }

  get localHost(): boolean {
    return this._localHost;
  }

  set localHost(value: boolean) {
    this._localHost = value;
  }

  get accessClaims(): AccessClaims {
    return this._accessClaims;
  }

  set accessClaims(value: AccessClaims) {
    this._accessClaims = value;
    if (value) {
      this.portalUser = Number(value.getSubject());
    }
  }
}