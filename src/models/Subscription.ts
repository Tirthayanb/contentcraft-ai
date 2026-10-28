import { Collection, Db, ObjectId } from "mongodb";
import dbConnect from "@/lib/db/mongodb";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "trialing"
  | "paused";

export interface Subscription {
  _id?: ObjectId;
  userId: ObjectId;
  status: SubscriptionStatus;
  planId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSubscriptionsCollection(): Promise<Collection<Subscription>> {
  const { db } = await dbConnect();
  const collection = db.collection<Subscription>("subscriptions");
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ status: 1 });
  return collection;
}

export async function createSubscription(
  subscription: Omit<Subscription, "_id" | "createdAt" | "updatedAt"> &
    Partial<Pick<Subscription, "createdAt" | "updatedAt">>
) {
  const collection = await getSubscriptionsCollection();
  const now = new Date();
  const doc: Subscription = {
    ...subscription,
    createdAt: subscription.createdAt || now,
    updatedAt: subscription.updatedAt || now,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findSubscriptionByUserId(userId: string | ObjectId) {
  const collection = await getSubscriptionsCollection();
  const uid = typeof userId === "string" ? new ObjectId(userId) : userId;
  return collection.findOne({ userId: uid });
}
