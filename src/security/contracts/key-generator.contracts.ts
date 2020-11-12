import { JwtType } from '../../domain/constants/jwt-type.constant';
import { SignatureKey } from '../../domain/entity/signature-key.entity';
import { EntityManager } from 'typeorm';

export interface KeyGenerator {
  generateKey(entityManager: EntityManager, jwtTokenType: JwtType): Promise<{ key: string; signature: SignatureKey }>;
}

export const KeyGenerator = Symbol('KeyGenerator');