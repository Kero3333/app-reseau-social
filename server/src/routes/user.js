const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const user = require("express").Router();

user.get("/:id", async (req, res) => {
  if (!req.params.id) return res.sendStatus(400);

  try {
    const _id = new ObjectId(req.params.id);
    const user = await database
      .collection("user")
      .findOne({ _id }, { projection: { profile: 1, posts: 1, network: 1 } });
    if (!user) return res.sendStatus(404);
    return res.send(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

user.post("/:id", async (req, res) => {
  if (!req.params.id) return res.sendStatus(400);

  const _id = new ObjectId(req.params.id);
  const { email, firstname, lastname, avatar, emailVisibility } = req.body;
  try {
    const { matchedCount } = await database.collection("user").updateOne(
      { _id },
      {
        $set: {
          email,
          profile: {
            firstname,
            lastname,
            avatar,
            email: emailVisibility,
          },
        },
      }
    );
    if (!matchedCount) return res.sendStatus(400);
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = user;
