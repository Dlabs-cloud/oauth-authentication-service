import { BaseRepository } from '@dlabs/common';
import { ClientCredential } from '../domain/entity/client-credential.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(ClientCredential)
export class ClientCredentialRepository extends BaseRepository<ClientCredential> {

}
