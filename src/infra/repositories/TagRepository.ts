import { Knex } from 'knex';
import TagsRepository from '../../application/repositories/TagRepository';
import Tag from '../../domain/Tag';
import { TagProperty } from '../../domain/TagProperty';
import { KnexDatabase } from '../database/knex/KnexDatabase';

export class KnexTagsRepository implements TagsRepository {
  private knex = KnexDatabase.getInstance();

  async create(tag: Tag): Promise<void> {
    const tagData = {
      id: tag.id,
      parent_id: tag.parentId,
      name: tag.name,
    };

    await this.knex('tags').insert(tagData);

    for (const prop of tag.properties) {
      await this.knex('tags_properties').insert({
        tag_id: tag.id,
        key: prop.key,
        value: prop.value,
        type: prop.type,
      });
    }
  }

  /* TODO: melhorar a tipagem depois */
  async findAll(): Promise<any[] | null> {
    const tags = await this.knex('tags');
    if (!tags.length) return null;
    const tagsIds = tags.map((tag) => tag.id);

    const properties = await this.knex('tags_properties').whereIn(
      'tag_id',
      tagsIds
    );

    const tagsWithProperties = tags.map((tag) => {
      return {
        ...tag,
        properties: properties.filter((property) => property.tag_id === tag.id),
      };
    });

    return tagsWithProperties;
  }

  async findById(id: string): Promise<Tag | null> {
    const tagData = await this.knex('tags').where({ id }).first();
    if (!tagData) return null;
    const propertiesData = await this.knex('tags_properties').where({
      tag_id: id,
    });
    const properties = propertiesData.map(
      (prop) => new TagProperty(prop.id, prop.key, prop.value, prop.type)
    );
    return Tag.restore(
      tagData.id,
      tagData.name,
      tagData.parent_id,
      tagData.name,
      properties
    );
  }

  async update(id: string, tag: Tag): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('tags').where({ id }).update({
        name: tag.name,
        parent_id: tag.parentId,
        description: tag.description,
        updated_at: new Date(),
      });
      await trx('tags_properties').where({ tag_id: id }).del();
      for (const property of tag.properties) {
        await trx('tags_properties').insert({
          id: property.id,
          tag_id: id,
          key: property.key,
          value: property.value,
          type: property.type,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await this.deleteTagAndChildren(id, trx);
    });
  }

  private async deleteTagAndChildren(
    id: string,
    trx: Knex.Transaction
  ): Promise<void> {
    const childTags = await trx('tags').where({ parent_id: id });
    for (const childTag of childTags) {
      await this.deleteTagAndChildren(childTag.id, trx);
    }

    await trx('tags_properties').where({ tag_id: id }).del();
    await trx('tags').where({ id }).del();
  }
}
