import { ApiResponseDto } from '@tss/common/data/api.response.dto';

export class ErrorResponseException extends Error {
  status: number;


  constructor(status: number, message: string) {
    super(message);
    this.status = status;


  }
}