const express = require('express');
const bodyParser = require(`body-parser`); // вспомогательное средство для работы с JSON
const app = express();
const port = 3000;


const users = require('./users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

const router = express.Router();
router.get(`/users`, (req, res) => {
  res.json(users.getUsers());
});

// создание пользователя
router.post(`/users`, (req, res) => {
  const id = users.createUser(req.query.name, req.query.score);
  res.json({message: `User created ${id}`});
});

// получение пользователя по id
router.get(`/users/:id`, (req, res) => {
  res.json(users.getUser(req.params.id));
});

// обновление информации о пользователе
router.put(`/users/:id`, (req, res) => {
  users.updateUser(req.params.id, req.query.name, req.query.score);
  res.json({message: `User update ${req.params.id}`});
});

// удаление пользователя
router.delete(`/users/:id`, (req, res) => {
  users.deleteUser(req.params.id);
  res.json({message: `User deleted ${req.params.id}`});
});

app.use(`/`, router);

app.use((req, res) => {
  res.status(404).send(req.originalUrl + ` not found`);
});

app.use((req, res) => {
  res.status(500).send(`internal server error`)
});

users.createUser('test1', 100);

// сервер 
app.listen(port, () => {
  console.log(`server started ${port}`);
});
