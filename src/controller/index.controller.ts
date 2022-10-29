import { Controller, Get, Req, Res } from '@nestjs/common';
import { Public } from '../security/decorators/public.decorator';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { Exclude } from 'class-transformer';


@Public()
@Controller()
export class IndexController {


  @Get('/health')
  health(@Res() response: Response) {
    response.json('we up and running ');
  }

  @Get('/api-docs')
  @Exclude()
  async apiDocs(@Req() request: Request, @Res() response: Response): Promise<string> {
    response.set({
      'content-type': 'application/json',
    });
    console.log(`${__dirname}/../openapi.json`)
    fs.createReadStream(process.env.API_DOC_PATH || `${__dirname}/../../openapi.json`).pipe(response);
    return;
  }

  @Get('/')
  async index(@Req() request: Request, @Res() response: Response): Promise<string> {
    response.set({
      'content-type': 'text/html',
    });
    fs.createReadStream(process.env.SWAGGER_UI_PATH || `${__dirname}/../../swagger-ui.html`).pipe(response);
    return;
  }
}
