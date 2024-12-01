const { MongoClient } = require('mongodb');

async function countDocuments() {
  const uri = "mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice"; // MongoDB 연결 URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("MakeNotice");
    const collection = database.collection("notices");

    // 전체 문서 개수 확인
    const totalDocuments = await collection.countDocuments();
    console.log(`전체 문서 개수: ${totalDocuments}`);
  } finally {
    await client.close();
  }
}

countDocuments().catch(console.error);
