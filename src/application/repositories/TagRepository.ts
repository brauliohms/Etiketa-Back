import { Tag } from '../../domain/Tag';

export default interface TagsRepository {
  create(tag: Tag): Promise<void>;
  findById(id: string): Promise<Tag | null>;
  findAll(): Promise<Tag[] | null>;
  update(id: string, data: Partial<Tag>): Promise<Tag | null>;
  delete(id: string): Promise<void>;
}
