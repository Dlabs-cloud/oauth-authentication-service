export class ApiResponseDto<T> {
  public readonly data?: T;

  public readonly message: string;

  public readonly code: number;

  constructor(code = 200, data?: T, message = 'Successfully') {
    this.data = data;
    this.message = message;
    this.code = code;
  }

}