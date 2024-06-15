import ApplicationError from './ApplicationError';

export default class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'Unauthorized Error';
  }
}
