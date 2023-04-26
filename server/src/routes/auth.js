const { database } = require("../db/database");

const auth = require("express").Router();

auth.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await database.collection("user").findOne({ email, password });
    if (!user) {
      return res.sendStatus(404);
    }

    return res.send(user._id);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

auth.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const user = await database.collection("user").findOne({ email });
    if (user) return res.send("this email is already used");
    const { id } = (
      await database.collection("user").insertOne({
        email: email,
        password: password,
        profile: {
          firstname: firstname,
          lastname: lastname,
          avatar: "",
          email: false,
        },
        posts: [],
        network: [],
      })
    ).insertedId;
    return res.send({ id });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

module.exports = auth;
