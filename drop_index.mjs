import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://cloud06store_db_user:cKHs79RpGlAo7z7F@libease.7adhcl4.mongodb.net/dogs?appName=libease";

async function dropIndex() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("dogs");
    const usersCollection = db.collection("users");
    
    const indexes = await usersCollection.listIndexes().toArray();
    console.log("Indexes before:", indexes.map(i => ({ name: i.name, key: i.key })));
    
    for (const idx of indexes) {
      if (idx.name !== "_id_") {
        try {
          console.log(`Dropping index: ${idx.name}`);
          await usersCollection.dropIndex(idx.name);
        } catch (e) {
          console.log(`Could not drop: ${e.message}`);
        }
      }
    }
    
    const indexesAfter = await usersCollection.listIndexes().toArray();
    console.log("Indexes after:", indexesAfter.map(i => i.name));
    
  } finally {
    await client.close();
  }
}

dropIndex().catch(console.error);
