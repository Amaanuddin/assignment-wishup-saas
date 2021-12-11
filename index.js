const express = require("express");
const { getUser, addUser } = require("./api/user");

const app = express();

const port = 4000;

app.listen(port, () => console.log(`The server is listening on port ${port}`));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/user/:username", (req, res) => {
  const user = getUser(req.params.username);
  if (!user) {
    res.status(400).send("something went wrong");
  } else {
    res.status(200).send(user);
  }
});

app.put("/user/:username", (req, res) => {
  try {
    addUser(req.params.username);
    res.status(200).send();
  } catch (err) {
    res.status(400);
    res.send("something went wrong");
  }
});
