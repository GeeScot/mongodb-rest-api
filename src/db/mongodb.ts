import { MongoClient, Collection, Document } from 'mongodb';

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING ?? '';
const mongoDatabaseName = process.env.DATABASE_NAME ?? '';

const mongoClient = new MongoClient(mongoConnectionString);

async function connect(): Promise<MongoClient> {
  return await mongoClient.connect();
}

async function getCollections(): Promise<any[]> {
  return await mongoClient.db(mongoDatabaseName).listCollections(undefined, { nameOnly: true }).toArray();
}

function getCollection<TModel extends Document>(collectionName: string): Collection<TModel> {
  return mongoClient.db(mongoDatabaseName).collection<TModel>(collectionName);
}

export { connect, getCollection, getCollections }
