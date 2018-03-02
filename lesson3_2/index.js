const MongoClient = require(`mongodb`).MongoClient;
const express = require(`express`);
const app = express();
const bodyParser = require(`body-parser`);
const ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

const url = `mongodb://localhost:27017/megaDataBase`;
const router = express.Router();

router.post(`/users`, (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(`Can not connect to data base`)
    } else {
      console.log("Connected correctly to data base");

      const collection = db.collection(`user_database`);
      const user = {};
      user.name = req.body.name;
      user.lastname = req.body.lastname;
      user.phone = req.body.phone;

      collection.insertOne(user, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.end();
          console.log(`UsEr inserted SuCcEsSfUlLy!`);
        }
      })
    }
    db.close();
  });
});

router.post(`/users/find`, (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(`Can not connect to data base`)
    } else {
      console.log("Connected correctly to data base");

      const collection = db.collection(`user_database`);
      const user = {};
      user.name = req.body.name;
      user.lastname = req.body.lastname;
      user.phone = req.body.phone;

      if (user.name !== ``) {
        collection.find({name: user.name}).toArray( (err, users) => {
          if (err) {
            console.log(`can not read data base!`)
          } else if (users.length) {
            res.send(users);
            res.end();
          } else {
            res.send(`user not found`);
          }
        })
      } else if (user.lastname !== ``) {
        collection.find({lastname: user.lastname}).toArray( (err, users) => {
          if (err) {
            console.log(`can not read data base!`)
          } else if (users.length) {
            res.send(users);
            res.end();
          } else {
            res.send(`user not found`);
          }
        })
      } else {
        collection.find({phone: user.phone}).toArray( (err, users) => {
          if (err) {
            console.log(`can not read data base!`)
          } else if (users.length) {
            res.send(users);
            res.end();
          } else {
            res.send(`user not found`);
          }
        })
      }
    }
    db.close();
  });
});

router.get(`/users`, (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(`Can not connect to data base`)
    } else {
      console.log("Connected correctly to data base");

      const collection = db.collection(`user_database`);
      collection.find({}).toArray( (err, users) => {
        if (err) {
          console.log(`can not read data base!`)
        } else if (users.length) {
          res.send(users);
          res.end();

        } else {
          console.log(`database is empty`);
        }
      });
    }
    db.close();
  });
});

router.put(`/users`, (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(`Can not connect to data base`)
    } else {
      console.log("Connected correctly to data base");

      const collection = db.collection(`user_database`);
      const id = ObjectId(req.body.id);
      const name = req.body.name;
      const lastname = req.body.lastname;
      const phone = req.body.phone;


      collection.updateOne({_id: id}, {$set: {name: name, lastname: lastname, phone: phone}}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json({message: `UsEr updated SuCcEsSfUlLy!`});
          res.end();
          console.log(`UsEr updated SuCcEsSfUlLy!`);
        }
      });
    }
    db.close();
  });
});

router.delete(`/users`, (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(`Can not connect to data base`)
    } else {
      console.log("Connected correctly to data base");

      const collection = db.collection(`user_database`);
      const id = ObjectId(req.body.id);

      collection.deleteOne({_id: id}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json({message: `UsEr DESTROYED SuCcEsSfUlLy!`});
          res.end();
          console.log(`UsEr DESTROYED SuCcEsSfUlLy!`);
        }
      });
    }
    db.close();
  });
});


app.use(`/api/v1`, router);
app.use(express.static(__dirname + `/public`));

app.use((req, res) => {
  res.status(404).send(req.originalUrl + ` NoT FoUnD!`);
});

app.use((req, res) => {
  res.status(500).send(`InTeRnAl SeRvEr ErRoR!!`)
});

app.listen(3000, () => {
  console.log(`server started`)
});
