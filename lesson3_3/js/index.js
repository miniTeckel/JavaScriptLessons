const express = require(`express`);
const app = express();
const bodyParser = require(`body-parser`);
const router = express.Router();
const UserModel = require(`./mongooseBase`).UserModel;
const TaskModel = require(`./mongooseBase`).TaskModel;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

app.use(`/api/v1`, router);
app.use(express.static(__dirname + `/public`));

app.use((req, res) => {
  res.status(404);
  console.log(`Not found URL: %s`,req.url);
  res.send({ error: `Not found` });
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  console.log(`Internal error(%d): %s`,res.statusCode,err.message);
  res.send({ error: err.message });
});

app.listen(3000, () => {
  console.log(`server started`)
});

router.get(`/data`, (req, res) => {
  const data = {};
  UserModel.find((err, users) => {
    if (!err) {
      data.users = users;
      TaskModel.find((err, tasks) => {
        if (!err) {
          data.tasks = tasks;
          TaskModel.aggregate({$match: {open: false}},
            {$project: {userName: 1, title: 1, date: 1, count: {$add: [1]}}},
            {$group: {_id: "$userName", closed_tasks: {$sum: "$count"}}},
            {$sort: {closed_tasks: -1}}, (err, result) => {
            if(!err) {
              data.stats = result;
              res.send(data);
            }
          });
        } else {
          res.statusCode = 500;
          console.log(`Internal error(%d): %s`,res.statusCode,err.message);
          res.send({ error: `Server error` });
        }
      });
    } else {
      res.statusCode = 500;
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
      res.send({ error: `Server error` });
    }
  });
});

router.get(`/users`, (req, res) => {
  UserModel.find((err, users) => {
    if (!err) {
      res.send(users);
    } else {
      res.statusCode = 500;
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
      res.send({ error: `Server error` });
    }
  });
});

router.post(`/users`, (req, res) => {
  const user = new UserModel({
    name: req.body.name,
  });

  user.save((err) => {
    if (!err) {
      console.log(`user created`);
    } else {
      console.log(err);
      if(err.name === `ValidationError`) {
        res.statusCode = 400;
        res.send({ error: `Validation error` });
      } else {
        res.statusCode = 500;
        res.send({ error: `Server error` });
      }
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
    }
  });
});

router.put('/users/:id', (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if(!user) {
      res.statusCode = 404;
      res.send({error: `user not found`});
    }

    user.name = req.body.name;
    user.save((err) => {
      if (!err) {
        console.log(`user updated`);
      } else {
        res.statusCode = 500;
        res.send({error: `Server error`});
      }
    });
  });
});


router.delete('/users/:id', (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if(!user) {
      res.statusCode = 404;
      res.send({error: `user not found`});
    }

    user.remove((err) => {
      if (!err) {
        console.log(`user removed`);
      } else {
        res.statusCode = 500;
        res.send({error: `Server error`});
      }
    });
  });
});


router.get(`/tasks`, (req, res) => {
  TaskModel.find((err, tasks) => {
    if (!err) {
      res.send(tasks);
    } else {
      res.statusCode = 500;
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
      res.send({ error: `Server error` });
    }
  });
});

router.post(`/tasks`, (req, res) => {
  const task = new TaskModel({
    date: req.body.date,
    title: req.body.title,
    description: req.body.description,
    open: req.body.open,
    user: req.body.user,
    userName: req.body.userName
  });

  console.log(task);

  task.save((err) => {
    if (!err) {
      console.log(`task created`);
    } else {
      console.log(err);
      if(err.name === `ValidationError`) {
        res.statusCode = 400;
        res.send({ error: `Validation error` });
      } else {
        res.statusCode = 500;
        res.send({ error: `Server error` });
      }
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
    }
  });
});

router.put('/tasks/:id', (req, res) => {
  TaskModel.findById(req.params.id, (err, task) => {
    if(!task) {
      res.statusCode = 404;
      res.send({error: `task not found`});
    }
    if(req.body.date) {
      task.date = req.body.date;
    }
    if(req.body.title) {
      task.title = req.body.title;
    }
    if(req.body.description) {
      task.description = req.body.description;
    }
    if(req.body.open === false) {
      task.open = false;
    } else {
      task.open = true;
    }
    if(req.body.user) {
      task.user = req.body.user;
    }
    if(req.body.userName) {
      task.userName = req.body.userName;
    }
    console.log(req.body.open);
    console.log(task.open);
    console.log(task);
    task.save((err) => {
      if (!err) {
        console.log(`task updated`);
        TaskModel.find((err, tasks) => {
          if (!err) {
            res.send(tasks);
          } else {
            res.statusCode = 500;
            console.log(`Internal error(%d): %s`,res.statusCode,err.message);
            res.send({ error: `Server error` });
          }
        });
      } else {
        res.statusCode = 500;
        res.send({error: `Server error`});
      }
    });
  });
});

router.delete('/tasks/:id', (req, res) => {
  TaskModel.findById(req.params.id, (err, task) => {
    if(!task) {
      res.statusCode = 404;
      res.send({error: `task not found`});
    }

    task.remove((err) => {
      if (!err) {
        console.log(`task removed`);
      } else {
        res.statusCode = 500;
        res.send({error: `Server error`});
      }
    });
  });
});

router.post(`/tasks/find`, (req, res) => {
  if (req.body.title) {
    const searchValue = req.body.title;
    TaskModel.find({title: searchValue}, (err, data) => {
      if (!err) {
        console.log(`task found`);
        res.send(data);
      } else {
        res.statusCode = 500;
        console.log(`Internal error(%d): %s`,res.statusCode,err.message);
        res.send({ error: `Server error` });
      }
    })
  }
  if (req.body.user) {
    const searchValue = req.body.user;
    TaskModel.find({user: searchValue}, (err, data) => {
      if (!err) {
        console.log(`task found`);
        console.log(data);

        res.send(data);
      } else {
        res.statusCode = 500;
        console.log(`Internal error(%d): %s`,res.statusCode,err.message);
        res.send({ error: `Server error` });
      }
    })
  }
  if(req.body.open) {
    const searchValue = req.body.open;
    TaskModel.find({open: searchValue}, (err, data) => {
      if (!err) {
        console.log(`task found`);
        console.log(data);

        res.send(data);
      } else {
        res.statusCode = 500;
        console.log(`Internal error(%d): %s`,res.statusCode,err.message);
        res.send({ error: `Server error` });
      }
    })
  }
});

router.get(`/tasks/sort`, (req, res) => {
  TaskModel.aggregate({$sort: {date: 1}}, (err, data) => {
    if (!err) {
      console.log(`task found`);
      res.send(data);
    } else {
      res.statusCode = 500;
      console.log(`Internal error(%d): %s`,res.statusCode,err.message);
      res.send({ error: `Server error` });
    }
  })
});