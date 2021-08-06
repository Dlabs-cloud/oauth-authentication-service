import { Client } from '../../domain/entity/client.entity';

export interface ClientIdSecretGenerator {
  generateId(): Promise<string>;

  generateSecret(): Promise<string>;
}

export const ClientIdSecretGenerator = Symbol('ClientIdSecretGenerator');
