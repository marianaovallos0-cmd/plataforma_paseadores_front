export class ApiException extends Error {
  code: string;
  details?: Record<string, string>;

  constructor(
    message: string,
    code: string,
    details?: Record<string, string>
  ) {

    super(message);

    this.code = code;
    this.details = details;
  }
}