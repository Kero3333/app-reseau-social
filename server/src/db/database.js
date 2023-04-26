const { MongoClient } = require("mongodb");

try {
  const client = new MongoClient(process.env.URI);
  client.connect();
  const database = client.db();
  module.exports = { database };
} catch (e) {
  console.log(e);
}
