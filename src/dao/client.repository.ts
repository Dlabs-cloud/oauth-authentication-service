import { BaseRepository } from '@dlabs/common';
import { Client } from '../domain/entity/client.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(ClientRepository)
export class ClientRepository extends BaseRepository<Client> {


  findBy
}
