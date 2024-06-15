import TagsRepository from '../repositories/TagRepository';
import NotFoundError from '../erros/NotFoundError';

export default class DeleteTagUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(id: string): Promise<void> {
    const tag = await this.tagsRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag not found');
    await this.tagsRepository.delete(id);
  }
}
