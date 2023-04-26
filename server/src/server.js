require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000 || process.env.PORT;

const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const network = require("./routes/network");
const posts = require("./routes/posts");

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/network", network);
app.use("/api/posts", posts);

app.listen(PORT, async () => {
  console.log("server is running on port " + PORT);
});
