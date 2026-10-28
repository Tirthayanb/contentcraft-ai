import { Collection, ObjectId } from "mongodb";
import dbConnect from "@/lib/db/mongodb";

export interface Usage {
  _id?: ObjectId;
  userId: ObjectId;
  month: string; // YYYY-MM
  tokensUsed: number;
  requestsUsed: number;
  quotaTokens?: number;
  quotaRequests?: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsageCollection(): Promise<Collection<Usage>> {
  const { db } = await dbConnect();
  const collection = db.collection<Usage>("usage");
  await collection.createIndex({ userId: 1, month: 1 }, { unique: true });
  return collection;
}

export async function createOrUpdateUsage(
  usage: Omit<Usage, "_id" | "createdAt" | "updatedAt"> &
    Partial<Pick<Usage, "createdAt" | "updatedAt">>
) {
  const collection = await getUsageCollection();
  const now = new Date();
  const filter = { userId: usage.userId, month: usage.month };
  const update = {
    $set: {
      tokensUsed: usage.tokensUsed,
      requestsUsed: usage.requestsUsed,
      quotaTokens: usage.quotaTokens,
      quotaRequests: usage.quotaRequests,
      updatedAt: now,
    },
    $setOnInsert: {
      createdAt: usage.createdAt || now,
    },
  };
  const result = await collection.updateOne(filter, update, { upsert: true });
  return result;
}

export async function findUsageByUserIdAndMonth(userId: string | ObjectId, month: string) {
  const collection = await getUsageCollection();
  const uid = typeof userId === "string" ? new ObjectId(userId) : userId;
  return collection.findOne({ userId: uid, month });
}
