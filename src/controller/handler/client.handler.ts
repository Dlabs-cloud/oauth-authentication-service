import { Inject, Injectable } from '@nestjs/common';
import { ClientIdSecretGenerator } from '../../security/contracts/clientIdSecret-generator.contracts';
import { Client } from '../../domain/entity/client.entity';
import { ClientCredential } from '../../domain/entity/client-credential.entity';
import { GenericStatus } from '@tss/common';
import { Encryption } from '../../security/contracts/encrption.contracts';

@Injectable()
export class ClientHandler {
  constructor(@Inject(ClientIdSecretGenerator) private readonly clientSecretGenerator: ClientIdSecretGenerator,
              @Inject(Encryption) private readonly encryption: Encryption) {
  }

  async createClientCredentials(client: Client) {
    const credential = new ClientCredential();
    credential.client = client;
    credential.identifier = await this.clientSecretGenerator.generateId();
    const secret = await this.clientSecretGenerator.generateSecret();
    credential.secret = await this.encryption.encrypt(secret);
    credential.status = GenericStatus.ACTIVE;
    return credential.save().then(creden => {
      creden.secret = secret;
      return credential;
    });
  }


}
