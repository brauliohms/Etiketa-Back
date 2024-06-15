import BodyValidationError from '../application/erros/BodyValidationError';

export class TagName {
  constructor(readonly value: string) {
    if (this.isInvalidName(value))
      throw new BodyValidationError('Invalid tag name');
  }

  isInvalidName(value: string): boolean {
    return value.trim().length === 0;
  }
}
