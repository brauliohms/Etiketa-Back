import BodyValidationError from '../application/erros/BodyValidationError';

export default class Name {
  constructor(readonly value: string) {
    if (this.isInvalidName(value))
      throw new BodyValidationError(
        'O nome deve conter pelo menos duas palavras separadas por um espaço'
      );
  }

  isInvalidName(value: string): boolean {
    return !value.match(/[a-zA-Z] [a-zA-Z]+/);
  }
}
