export class ApiResponseDto<T> {
  private readonly data?: T;

  private readonly message: string;

  private readonly code: number;

  constructor(code = 200, data?: T, message = 'Successfully') {
    this.data = data;
    this.message = message;
    this.code = code;
  }

}