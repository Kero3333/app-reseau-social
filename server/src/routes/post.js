const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const post = require("express").Router();

post.post("/add", async (req, res) => {
  try {
    const { id, message, visibility } = req.body;

    const {
      posts: { id: lastPostId },
    } = await database
      .collection("user")
      .aggregate([
        { $match: { "profile.lastname": "Miller" } },
        { $unwind: "$posts" },
        { $sort: { posts: -1 } },
        { $limit: 1 },
        { $project: { "posts.id": 1, _id: 0 } },
      ])
      .next();

    const { matchedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: {
          posts: {
            id: lastPostId + 1,
            message,
            date: new Date().getTime(),
            visibility: visibility,
            comments: [],
            likes: [],
          },
        },
      }
    );
    if (!matchedCount) return res.sendStatus(400);
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

post.post("/modify", async (req, res) => {
  try {
    const { id, postId, message, visibility } = req.body;
    const { matchedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "posts.$[post].message": message,
          "posts.$[post].visibility": visibility,
        },
      },
      { arrayFilters: [{ "post.id": { $eq: postId } }] }
    );
    if (!matchedCount) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

post.delete("/", async (req, res) => {
  try {
    const { id, postId } = req.body;
    const { modifiedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: {
          posts: { id: postId },
        },
      }
    );
    if (!modifiedCount) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

post.post("/like", async (req, res) => {
  try {
    const { id, postId, userId } = req.body;
    const isLiked = await database
      .collection("user")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$posts" },
        {
          $match: {
            "posts.id": postId,
          },
        },
        { $unwind: "$posts.likes" },
        {
          $match: { "posts.likes.id_user": new ObjectId(userId) },
        },
        { $project: { "posts.likes.id_user": 1, _id: 0 } },
      ])
      .next();

    const { modifiedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id), "posts.id": postId },
      isLiked
        ? {
            $pull: {
              "posts.$.likes": {
                id_user: new ObjectId(userId),
              },
            },
          }
        : {
            $addToSet: {
              "posts.$.likes": {
                id_user: new ObjectId(userId),
              },
            },
          }
    );
    if (!modifiedCount) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

post.post("/comment/add", async (req, res) => {
  try {
    const { id, postId, userId, message } = req.body;

    const lastComment = await database
      .collection("user")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$posts" },
        { $match: { "posts.id": postId } },
        { $unwind: "$posts.comments" },
        { $sort: { "posts.comments": -1 } },
        { $replaceRoot: { newRoot: "$posts.comments" } },
        { $project: { id: 1, _id: 0 } },
      ])
      .next();

    const { matchedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id), "posts.id": postId },
      {
        $addToSet: {
          "posts.$.comments": {
            id: (lastComment?.id > -1 ? lastComment.id : -1) + 1,
            id_user: new ObjectId(userId),
            message: message,
            date: new Date().getTime(),
          },
        },
      }
    );
    if (!matchedCount) return res.sendStatus(400);
    res
      .status(201)
      .send({ id: (lastComment?.id > -1 ? lastComment.id : -1) + 1 });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

post.post("/comment/modify", async (req, res) => {
  try {
    const { id, postId, commentId, message } = req.body;

    const { modifiedCount } = await database.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { "posts.$[post].comments.$[comment].message": message },
      },
      {
        arrayFilters: [
          { "post.id": { $eq: postId } },
          { "comment.id": { $eq: commentId } },
        ],
      }
    );
    if (!modifiedCount) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

post.delete("/comment/remove", async (req, res) => {
  try {
    const { id, postId, commentId } = req.body;
    const { modifiedCount } = await database
      .collection("user")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { "posts.$[post].comments": { id: commentId } } },
        { arrayFilters: [{ "post.id": { $eq: postId } }] }
      );
    if (!modifiedCount) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = post;
