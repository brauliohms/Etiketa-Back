import ApplicationError from './ApplicationError';

export default class BodyValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BodyValidationError';
  }
}
