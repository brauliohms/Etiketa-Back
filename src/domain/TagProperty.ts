import BodyValidationError from '../application/erros/BodyValidationError';

export type PropertyType = 'text' | 'number' | 'date';

export class TagProperty {
  constructor(
    readonly id: string,
    readonly key: string,
    readonly value: string,
    readonly type: PropertyType
  ) {
    if (this.isInvalidKey(key))
      throw new BodyValidationError('Invalid property key');
    if (this.isInvalidValue(value))
      throw new BodyValidationError('Invalid property value');
    if (this.isInvalidType(type))
      throw new BodyValidationError('Invalid property type');
  }

  isInvalidKey(value: string): boolean {
    return value.trim().length === 0;
  }

  isInvalidValue(value: string): boolean {
    return value.trim().length === 0;
  }

  isInvalidType(value: PropertyType): boolean {
    const validTypes: PropertyType[] = ['text', 'number', 'date'];
    return !validTypes.includes(value);
  }

  static restore(
    id: string,
    key: string,
    value: string,
    type: PropertyType
  ): TagProperty {
    return new TagProperty(id, key, value, type);
  }
}
