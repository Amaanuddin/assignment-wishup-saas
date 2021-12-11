const { users } = require("../../data");
const moment = require("moment");

module.exports = {
  addUser: (username) => {
    const user = {
      user_name: username,
      created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    users.push(user);
  },
  getUser: (username) => {
    return users.find((user) => user.user_name === username);
  },
};
