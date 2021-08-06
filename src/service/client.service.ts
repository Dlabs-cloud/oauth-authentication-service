import { ClientRegistrationRequest } from '../data/request/client-registration.request';
import { Client } from '../domain/entity/client.entity';
import { GenericStatus } from '@tss/common';

export interface ClientService {
  createClient(clientDto: ClientRegistrationRequest): Promise<Client>;

  updateClient(client: Client, status: GenericStatus)
}

export const ClientService = Symbol('ClientService');
