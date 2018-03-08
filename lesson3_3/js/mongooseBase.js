const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/userDataBase', {
  useMongoClient: true,
});
const db = mongoose.connection;

db.on('error', function (err) {
  console.log('connection error:', err.message);
});
db.once('open', function callback () {
  console.log("Connected to DB!");
});

const Users = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
});

const Tasks = new Schema({
  date: Date,
  title: String,
  description: String,
  open: Boolean,
  user: String,
  userName: String
});

const UserModel = mongoose.model(`User`, Users);
const TaskModel = mongoose.model(`Task`, Tasks);

module.exports = {
  UserModel,
  TaskModel
};