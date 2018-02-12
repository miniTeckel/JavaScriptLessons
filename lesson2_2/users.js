let users = [];

const methods = {
    getUsers: () => {
      return users;
    },
  
    getUser: (userId) => {
      return users[userId];
    },
  
    createUser: (name, score) => {
      const user = {};
      user.id = users.length;
      user.name = name;
      user.score = score;
      users.push(user);
      return user.id;
    },
  
    updateUser: (userId, name, score) => {
      users[userId].name = name;
      users[userId].score = score;
    },
  
    deleteUser: (userId) => {
      users.splice(userId, 1);
    }
  };

module.exports = methods;