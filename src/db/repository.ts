import { Filter, Collection, UpdateFilter, Sort, ObjectId, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { collection } from '../db/mongodb';

export default class Repository<TModel extends { _id?: ObjectId, tenantId: string }> {
  private collection: Collection<TModel>;

  constructor(collectionName: string) {
    this.collection = collection<TModel>(collectionName);
  }

  async all(filter: Filter<TModel>, sort: Sort = {}): Promise<WithId<TModel>[]> {
    return await this.collection
      .find(filter)
      .sort(sort)
      .toArray();
  }

  async get(query: Filter<TModel>): Promise<WithId<TModel> | null> {
    return await this.collection.findOne(query);
  }

  async insert(...objs: TModel[]): Promise<void> {
    await this.collection.insertMany(objs.map(obj => <OptionalUnlessRequiredId<TModel>>(obj)));
  }

  async update(filter: Filter<TModel>, updateQuery: UpdateFilter<TModel>): Promise<void> {
    await this.collection.updateOne(filter, updateQuery);
  }

  async remove(filter: Filter<TModel>): Promise<void> {
    await this.collection.deleteMany(filter);
  }
}
