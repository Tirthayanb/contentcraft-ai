import { Collection, ObjectId } from "mongodb";
import dbConnect from "@/lib/db/mongodb";

export interface UploadedFile {
  _id?: ObjectId;
  userId?: ObjectId;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUploadedFilesCollection(): Promise<Collection<UploadedFile>> {
  const { db } = await dbConnect();
  const collection = db.collection<UploadedFile>("uploaded_files");
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ createdAt: -1 });
  return collection;
}

export async function createUploadedFile(
  file: Omit<UploadedFile, "_id" | "createdAt" | "updatedAt"> &
    Partial<Pick<UploadedFile, "createdAt" | "updatedAt">>
) {
  const collection = await getUploadedFilesCollection();
  const now = new Date();
  const doc: UploadedFile = {
    ...file,
    createdAt: file.createdAt || now,
    updatedAt: file.updatedAt || now,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findUploadedFilesByUserId(userId: string | ObjectId) {
  const collection = await getUploadedFilesCollection();
  const uid = typeof userId === "string" ? new ObjectId(userId) : userId;
  return collection.find({ userId: uid }).sort({ createdAt: -1 }).toArray();
}
