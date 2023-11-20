import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL ?? "mongodb://localhost:27017";

console.log("MONGO_URL", MONGO_URL);

const client = new MongoClient(MONGO_URL);

export const db = client.db("dynamic-forms");
