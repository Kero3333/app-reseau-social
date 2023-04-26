const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const posts = require("express").Router();

posts.get("/:page", async (req, res) => {
  const page = req.params.page;
  const posts = await database
    .collection("user")
    .aggregate([
      { $match: { _id: { $ne: "2" } } },
      { $project: { posts: 1, _id: 1 } },
    ])
    .toArray();
  console.log(posts);
  res.send(posts);
});

module.exports = posts;
