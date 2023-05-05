const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const posts = require("express").Router();

posts.get("/", async (req, res) => {
  const posts = await database
    .collection("user")
    .aggregate([
      { $match: { _id: { $ne: "2" } } },
      { $unwind: "$posts" },
      { $sort: { "posts.date": -1 } },
      { $project: { posts: 1, _id: 1, profile: 1 } },
    ])
    .toArray();
  console.log(posts);
  res.send(posts);
});

module.exports = posts;
