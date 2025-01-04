import { MongoClient, Db } from "mongodb";

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error("MONGODB_URI is not defined");
}

const client: MongoClient = new MongoClient(connectionString);

export const database: Db = client.db("study-hub");
