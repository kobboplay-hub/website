export class CustomerApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "CustomerApiError";
    this.code = code;
  }
}
