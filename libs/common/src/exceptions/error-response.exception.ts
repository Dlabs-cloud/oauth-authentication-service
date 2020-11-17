import { ApiResponseDto } from '@tss/common/data/api.response.dto';

export class ErrorResponseException extends Error {
  status: number;
  response: any;

  constructor(status: number, response: any) {
    super();
    this.status = status;
    this.response = response;

  }
}