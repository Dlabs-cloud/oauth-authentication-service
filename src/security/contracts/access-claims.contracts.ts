export interface AccessClaims {
  getId(): string

  getKid(): string;

  getIssuer(): string;

  getSubject(): string;

  getExpirationTime(): Date;

  getStartTime(): Date;

  getTimeIssued(): Date;

  getAudience(): string[];
}