import ApplicationError from './ApplicationError';

export default class UserAlreadyExists extends ApplicationError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'UserAlreadyExists';
  }
}
