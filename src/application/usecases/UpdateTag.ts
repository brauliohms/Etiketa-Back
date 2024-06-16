import NotFoundError from '../erros/NotFoundError';
import TagsRepository from '../repositories/TagRepository';

export default class UpdateTagUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(id: string, input: Input): Promise<void> {
    try {
      const tag = await this.tagsRepository.findById(id);
      if (!tag) throw new NotFoundError('Tag not found');
      tag.update(
        input.name,
        input.parentId,
        input.description,
        input.properties
      );
      console.log(tag);
      await this.tagsRepository.update(id, tag);
    } catch (error) {
      console.log(error);
    }
  }
}

type Properties = {
  id?: string;
  key: string;
  value: string;
  type: 'date' | 'number' | 'text';
};

type Input = {
  id: string;
  name: string;
  parentId: string | null;
  description: string | null;
  properties: Properties[];
};
