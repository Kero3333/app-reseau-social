const { database } = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const user = require("express").Router();

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPIKEYSECRET,
});

user.get("/:id", async (req, res) => {
  if (!req.params.id) return res.sendStatus(400);

  try {
    const _id = new ObjectId(req.params.id);
    const user = await database
      .collection("user")
      .findOne(
        { _id },
        { projection: { email: 1, profile: 1, posts: 1, network: 1 } }
      );
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

  const avatarUrl = await cloudinary.uploader.upload(avatar, {
    public_id: `${_id}`,
  });

  const url = cloudinary.url(`${_id}`, {
    width: 150,
    height: 150,
    Crop: "fill",
  });

  try {
    const { matchedCount } = await database.collection("user").updateOne(
      { _id },
      {
        $set: {
          email,
          profile: {
            firstname,
            lastname,
            avatar: url,
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
