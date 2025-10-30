const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "prompApp";
const client = new MongoClient(uri);

let _db;

async function connect() {
  if (!_db) {
    await client.connect();
    _db = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
  }
  return _db;
}

module.exports = { connect };
