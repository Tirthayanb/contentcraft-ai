import { Collection, ObjectId } from "mongodb";
import dbConnect from "@/lib/db/mongodb";

export type UserRole = "visitor" | "customer" | "member";

export type SubscriptionStatus = "inactive" | "active" | "past_due" | "cancelled";

export interface UserSubscription {
  status: SubscriptionStatus;
  planId: string | null;
  currentPeriodEnd: number | null;
}

export interface User {
  _id?: ObjectId;
  email?: string;
  role: UserRole;
  name?: string;
  passwordHash?: string;
  subscription: UserSubscription;
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number | null;
}

export interface SafeUser {
  id: string;
  email?: string;
  role: UserRole;
  name?: string;
  subscription: UserSubscription;
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number | null;
}

export function toSafeUser(user: Record<string, unknown>): SafeUser {
  const normalized = normalizeUserRecord(user);
  return {
    id: normalized._id ? normalized._id.toString() : "",
    email: normalized.email,
    role: normalized.role,
    name: normalized.name,
    subscription: normalized.subscription,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    lastLoginAt: normalized.lastLoginAt,
  };
}

export function getDefaultSubscription(): UserSubscription {
  return {
    status: "inactive",
    planId: null,
    currentPeriodEnd: null,
  };
}

export function normalizeUserRecord(user: Record<string, unknown>): User {
  const rawRole = typeof user.role === "string" ? user.role : "customer";
  const rawSub = (user.subscription && typeof user.subscription === "object")
    ? (user.subscription as Record<string, unknown>)
    : null;

  const validStatuses: SubscriptionStatus[] = ["inactive", "active", "past_due", "cancelled"];
  const status: SubscriptionStatus =
    rawSub && typeof rawSub.status === "string" && validStatuses.includes(rawSub.status as SubscriptionStatus)
      ? (rawSub.status as SubscriptionStatus)
      : "inactive";

  const planId = rawSub && typeof rawSub.planId === "string" ? rawSub.planId : null;
  const currentPeriodEnd =
    rawSub && typeof rawSub.currentPeriodEnd === "number" ? rawSub.currentPeriodEnd : null;

  const subscription: UserSubscription = {
    status,
    planId,
    currentPeriodEnd,
  };

  let role: UserRole;
  if (rawRole === "member") {
    // Only genuine active subscribers retain member access; otherwise fallback to customer
    role = status === "active" ? "member" : "customer";
  } else if (rawRole === "customer") {
    role = "customer";
  } else if (rawRole === "visitor") {
    role = "visitor";
  } else if (rawRole === "paid_customer") {
    // Safely migrate legacy paid_customer role
    role = status === "active" ? "member" : "customer";
  } else {
    // Default legacy / unknown roles to customer
    role = "customer";
  }

  const now = Date.now();

  return {
    _id: user._id as ObjectId | undefined,
    email: typeof user.email === "string" ? user.email : undefined,
    role,
    name: typeof user.name === "string" ? user.name : undefined,
    passwordHash: typeof user.passwordHash === "string" ? user.passwordHash : undefined,
    subscription,
    createdAt: typeof user.createdAt === "number" ? user.createdAt : now,
    updatedAt: typeof user.updatedAt === "number" ? user.updatedAt : now,
    lastLoginAt: typeof user.lastLoginAt === "number" ? user.lastLoginAt : null,
  };
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const { db } = await dbConnect();
  const collection = db.collection<User>("User");
  await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
  await collection.createIndex({ role: 1 });
  return collection;
}

export async function createUser(
  user: Omit<User, "_id" | "createdAt" | "updatedAt" | "lastLoginAt" | "role" | "subscription"> & {
    // role is strictly overridden internally; callers cannot specify role
    role?: never;
    subscription?: never;
  } & Partial<Pick<User, "createdAt" | "updatedAt" | "lastLoginAt">>
) {
  const collection = await getUsersCollection();
  const now = Date.now();
  // New signups must always receive customer role and inactive subscription
  const doc: User = {
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    role: "customer",
    subscription: getDefaultSubscription(),
    createdAt: user.createdAt ?? now,
    updatedAt: user.updatedAt ?? now,
    lastLoginAt: user.lastLoginAt ?? null,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateUserLastLogin(id: string | ObjectId) {
  const collection = await getUsersCollection();
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  const now = Date.now();
  await collection.updateOne(
    { _id },
    { $set: { lastLoginAt: now, updatedAt: now } }
  );
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const collection = await getUsersCollection();
  const raw = await collection.findOne({ email });
  if (!raw) return null;
  return normalizeUserRecord(raw as unknown as Record<string, unknown>);
}

export async function findUserById(id: string | ObjectId): Promise<User | null> {
  const collection = await getUsersCollection();
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  const raw = await collection.findOne({ _id });
  if (!raw) return null;
  return normalizeUserRecord(raw as unknown as Record<string, unknown>);
}
