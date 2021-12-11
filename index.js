const express = require("express");
const { addSubscription, getPlan } = require("./api/subscription");
const { getUser, addUser } = require("./api/user");
const moment = require("moment");

const app = express();

const port = 4000;
app.use(express.json());

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
    res.status(400).send("something went wrong");
  }
});

app.post("/subscription", (req, res) => {
  const { user_name, plan_id, start_date } = req.body;
  let plan = {};
  try {
    const user = getUser(user_name);
    if (!user) {
      plan = undefined;
      throw new Error("Invalid user");
    }
    plan = getPlan(plan_id);
    if (!plan) {
      throw new Error("Invalid plan");
    }
    addSubscription({
      plan,
      user_name,
      start_date,
    });

    res.status(200).send({ status: "SUCCESS", amount: -plan.price });
  } catch (err) {
    res.status(400).send({ status: "FAILURE", amount: plan ? plan.price : 0 });
  }
});

app.get("/subscription/:username/:date?", (req, res) => {
  try {
    const user = getUser(req.params.username);
    if (!user) {
      throw new Error("Invalid user");
    }
    const { subscriptions } = user;
    if (!req.params.date) {
      res.status(200).send(subscriptions);
      return;
    }
    const activeSubscription = subscriptions
      .filter((sub) =>
        moment(req.params.date).isBetween(sub.start_date, sub.valid_till)
      )
      .map((sub) => {
        return {
          plan_id: sub.plan_id,
          days_left: moment
            .duration({ from: req.params.date, to: sub.valid_till })
            .asDays(),
        };
      });
    res.status(200).send(activeSubscription);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
