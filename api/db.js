const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;
const url = process.env.DB_URL || 'mongodb+srv://darshan123:darshan123@nodeproject.ktfrn.mongodb.net/mydb?retryWrites=true&w=majority';

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
