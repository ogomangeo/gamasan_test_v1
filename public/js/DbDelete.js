const { MongoClient } = require('mongodb');

async function deleteAllDocuments() {
  const uri = "mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice"; // MongoDB 연결 URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("MakeNotice");
    const collection = database.collection("marts");

    // 컬렉션의 모든 문서 삭제
    const result = await collection.deleteMany({});
    console.log(`삭제된 문서 개수: ${result.deletedCount}`);
  } finally {
    await client.close();
  }
}

deleteAllDocuments().catch(console.error);
