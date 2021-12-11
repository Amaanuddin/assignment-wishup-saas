const { users, subscriptions } = require("../../data");
const { getUser } = require("../user");
const moment = require("moment");

module.exports = {
  addSubscription: ({ user_name, plan, start_date }) => {
    const userSubscription = {
      plan_id: plan.plan_id,
      start_date: moment(start_date).format("YYYY-MM-DD hh:mm:ss"),
      valid_till:
        plan.plan_id === "FREE"
          ? moment(plan.validity).format("YYYY-MM-DD hh:mm:ss")
          : moment(start_date)
              .add(plan.validity, "d")
              .format("YYYY-MM-DD hh:mm:ss"),
    };
    const userIndex = users.findIndex((user) => user.user_name == user_name);
    users[userIndex] = {
      ...users[userIndex],
      subscriptions: [...users[userIndex].subscriptions, userSubscription],
    };
  },
  getUserSubscriptions: (username) => {
    const user = getUser(username);
    const { subscriptions } = user;
    return subscriptions;
  },
  getPlan: (plan_id) => {
    return subscriptions.find(
      (subscription) => subscription.plan_id === plan_id
    );
  },
};
