import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error('DATABASE_URL no está configurada en las variables de entorno');
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default connectToDatabase;
