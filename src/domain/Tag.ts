import { randomUUID } from 'crypto';
import { PropertyType, TagProperty } from './TagProperty';

export default class Tag {
  constructor(
    public id: string,
    public name: string,
    public parentId: string | null,
    public description: string | null,
    public properties: TagProperty[]
  ) {}

  static create(
    name: string,
    properties: { key: string; value: string; type: PropertyType }[],
    parentId?: string | null,
    description?: string | null
  ) {
    const tagProperties = properties.map(
      (p) => new TagProperty(randomUUID(), p.key, p.value, p.type)
    );
    return new Tag(
      randomUUID(),
      name,
      parentId || null,
      description || '',
      tagProperties
    );
  }

  static restore(
    id: string,
    name: string,
    parentId: string | null,
    description: string | null,
    properties: { id: string; key: string; value: string; type: PropertyType }[]
  ) {
    const tagProperties = properties.map((p) =>
      TagProperty.restore(p.id, p.key, p.value, p.type)
    );
    return new Tag(id, name, parentId, description, tagProperties);
  }

  update(
    name: string,
    parentId: string | null,
    description: string | null,
    properties: {
      id?: string;
      key: string;
      value: string;
      type: PropertyType;
    }[]
  ) {
    this.name = name;
    this.parentId = parentId;
    this.description = description || '';

    this.properties = properties.map((p) => {
      const id = p.id || randomUUID();
      return TagProperty.restore(id, p.key, p.value, p.type);
    });
  }
}
