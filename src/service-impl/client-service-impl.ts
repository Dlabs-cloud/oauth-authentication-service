import { ClientRegistrationRequest } from '../data/request/client-registration.request';
import { Client } from '../domain/entity/client.entity';
import { Injectable } from '@nestjs/common';
import { ClientResponse } from '../data/response/client.response';
import { GenericStatus } from '@dlabs/common';
import { ClientService } from '../service/client.service';


@Injectable()
export class ClientServiceImpl implements ClientService {

  async createClient(clientDto: ClientRegistrationRequest): Promise<Client> {
    const client = new Client();
    client.email = clientDto.email.toLowerCase();
    client.name = clientDto.name;
    return await client.save();
  }


  async updateClient(client: Client, status: GenericStatus): Promise<ClientResponse> {
    client.status = status;
    return client.save().then(client => {
      return {
        name: client.name,
        email: client.email,
      } as ClientResponse;
    });
  }
}
