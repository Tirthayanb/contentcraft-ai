import { MongoClient, Db, Collection, Document } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  var _mongo: MongoCache | undefined;
}

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, db: null, promise: null };
}

async function dbConnect() {
  if (cached!.db) {
    return { client: cached!.client!, db: cached!.db! };
  }

  if (!cached!.promise) {
    const client = new MongoClient(MONGODB_URI!, {
      maxPoolSize: 10,
    });
    cached!.promise = client.connect().then((connectedClient) => {
      const db = connectedClient.db();
      return { client: connectedClient, db };
    });
  }

  try {
    const result = await cached!.promise;
    cached!.client = result.client;
    cached!.db = result.db;
    return result;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }
}

export default dbConnect;
export { dbConnect };
