export interface AccessClaims {
  getId(): string

  getIssuer(): string;

  getSubject(): string;

  getAudience(): string[]

  getExpirationTime(): Date;

  getStartTime(): Date;

  getTimeIssued(): Date;
}