import Tag from '../../domain/Tag';

export default interface TagsRepository {
  create(tag: Tag): Promise<void>;
  findById(id: string): Promise<Tag | null>;
  findAll(): Promise<Tag[] | null>;
  update(id: string, tag: Tag): Promise<void>;
  delete(id: string): Promise<void>;
}
