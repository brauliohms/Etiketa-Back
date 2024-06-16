import Tag from '../../domain/Tag';
import { PropertyType } from '../../domain/TagProperty';
import TagsRepository from '../repositories/TagRepository';

export default class CreateTagUseCase {
  constructor(private readonly tagRepository: TagsRepository) {}

  async execute(input: Input): Promise<void> {
    try {
      const { name, properties } = input;
      const tag = Tag.create(name, properties);
      await this.tagRepository.create(tag);
    } catch (error) {
      console.log(error);
    }
  }
}

type Properties = {
  key: string;
  value: string;
  type: PropertyType;
};

type Input = {
  name: string;
  properties: Properties[];
};
