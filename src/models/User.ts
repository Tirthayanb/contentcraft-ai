import { Collection, ObjectId } from "mongodb";
import dbConnect from "@/lib/db/mongodb";

export type UserRole = "visitor" | "free_customer" | "paid_customer";

export interface User {
  _id?: ObjectId;
  email?: string;
  role: UserRole;
  name?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const { db } = await dbConnect();
  const collection = db.collection<User>("users");
  await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
  await collection.createIndex({ role: 1 });
  return collection;
}

export async function createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<User, "createdAt" | "updatedAt">>) {
  const collection = await getUsersCollection();
  const now = new Date();
  const doc: User = {
    ...user,
    createdAt: user.createdAt || now,
    updatedAt: user.updatedAt || now,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findUserByEmail(email: string) {
  const collection = await getUsersCollection();
  return collection.findOne({ email });
}

export async function findUserById(id: string | ObjectId) {
  const collection = await getUsersCollection();
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  return collection.findOne({ _id });
}
