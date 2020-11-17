export interface JwtTokenPayloadDto {
  userId: string;
  nbf: number;
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  jti: string;
  kid?: string;
}