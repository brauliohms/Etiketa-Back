export default class ApplicationError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApplicationError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
