import { Body, Controller, Get, HttpStatus, Inject, NotFoundException, Post, Req } from '@nestjs/common';
import { ClientRegistrationRequest } from '../data/request/client-registration.request';
import { ClientService } from '../service/client.service';
import { Public } from '../security/decorators/public.decorator';
import { ClientHandler } from './handler/client.handler';
import { ApiResponseDto } from '../data/response/api.response.dto';
import { ClientResponse } from '../data/response/client.response';
import { Connection } from 'typeorm';

@Controller('clients')
export class ClientController {

  constructor(@Inject(ClientService) private readonly clientService: ClientService,
              private readonly clientHandler: ClientHandler,
              private readonly connection: Connection) {
  }

  @Post()
  @Public()
  async createClient(@Body() request: ClientRegistrationRequest): Promise<ApiResponseDto<ClientResponse>> {
    const client = await this.clientService.createClient(request);
    const clientCredential = await this.clientHandler.createClientCredentials(client);
    const clientResponse = new ClientResponse();
    clientResponse.name = client.name;
    clientResponse.email = client.email;
    clientResponse.identifier = clientCredential.identifier;
    clientResponse.secret = clientCredential.secret;
    return new ApiResponseDto<ClientResponse>(HttpStatus.CREATED, clientResponse);
  }


  // @Get('/me')
  // getClient(@Req() request: Request) {
  //   const token = this.getToken(request);
  //   if (!token) {
  //     throw new NotFoundException('Client cannot be found');
  //   }
  //
  //   this.connection.getCustomRepository(Clie)
  //
  // }

  // private getToken(request): string | null {
  //   const authorisationToken = request.header('Authorization');
  //   if (authorisationToken) {
  //     if (authorisationToken.startsWith(this.tokenPrefix)) {
  //       return authorisationToken.substring(this.tokenPrefix.length);
  //     }
  //   }
  //   return null;
  // }
}
