import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class HashService {
  public hash(value: string, saltRounds?: number): Promise<string> {
    let round = saltRounds || 10;
    return genSalt(round).then((salt: string) => {
      return hash(value, salt);
    });
  }

  public compare(value: string, hashedValue: string) {
    return compare(value, hashedValue);
  }
}