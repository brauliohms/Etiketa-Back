import BodyValidationError from '../application/erros/BodyValidationError';

export default class Email {
  constructor(readonly value: string) {
    if (this.isInvalidEmail(value))
      throw new BodyValidationError('Invalid email');
  }

  isInvalidEmail(value: string): boolean {
    return !value.match(/^(.+)@(.+)$/);
  }
}
