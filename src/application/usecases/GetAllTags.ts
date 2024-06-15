import { Tag } from '../../domain/Tag';
import TagsRepository from '../repositories/TagRepository';

export default class GetAllTagsUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(): Promise<Tag[] | null> {
    return await this.tagsRepository.findAll();
  }
}
