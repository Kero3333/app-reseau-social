const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const network = require("express").Router();

network.post("/", async (req, res) => {
  const { id, userId } = req.body;
  try {
    const isAlreadyAsked = await database
      .collection("user")
      .aggregate([
        { $match: { _id: { $in: [new ObjectId(id), new ObjectId(userId)] } } },
        { $unwind: "$network" },
        {
          $match: {
            "network.id_user": {
              $in: [new ObjectId(userId), new ObjectId(id)],
            },
          },
        },
        // { $project: { "network.id_user": 1, _id: 0 } },
      ])
      .toArray();

    console.log(isAlreadyAsked);
    const { modifiedCount: sender } = await database
      .collection("user")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $addToSet: {
            network: {
              id_user: new ObjectId(userId),
              status: "pending",
              sender: 1,
            },
          },
        }
      );
    if (!sender) return res.sendStatus(400);

    const { modifiedCount: reciever } = await database
      .collection("user")
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $addToSet: {
            network: {
              id_user: new ObjectId(id),
              status: "pending",
              sender: 0,
            },
          },
        }
      );
    if (!reciever) return res.sendStatus(400);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

network.delete("/", async (req, res) => {
  const { id, userId } = req.body;
  try {
    const { modifiedCount: sender } = await database
      .collection("user")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { network: { id_user: new ObjectId(userId) } } }
      );
    console.log(sender);
    if (!sender) return res.sendStatus(404);
    const { modifiedCount: receiver } = await database
      .collection("user")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { network: { id_user: new ObjectId(id) } } }
      );
    console.log(receiver);

    if (!receiver) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = network;
