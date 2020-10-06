const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 7000;

// Database Connection (Mongodb)
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.g7kps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Add to Database ............
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // const volunteersCollection = client.db("volunteer-network").collection("volunteer");
    const volunteerEvents = client.db("volunteer-network").collection("events");

  //addToDatabase.....
  app.post("/addToDatabase", (req, res) => {
    const fields = req.body;
    volunteerEvents.insertMany(fields).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  //createNewEvent
  app.post("/createNewEvent", (req, res) => {
    const field = req.body;
    volunteerEvents.insertOne(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  //eventFields
  app.get("/eventFields", (req, res) => {
    volunteerEvents.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

// events add to mongo ...................
client.connect(err => {
  const volunteersCollection = client.db("volunteer-network").collection("volunteer");
  //addEvents ......
  app.post("/addEvents", (req, res) => {
    const events = req.body;
    volunteersCollection.insertOne(events).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  //getEvents......
  app.get("/getEvents", (req, res) => {
    volunteersCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //allEvents .....
  app.get("/allEvents", (req, res) => {
    volunteersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //delete event ....
  app.delete("/delete/:id", (req, res) => {
    volunteersCollection
      .deleteOne({
        _id: ObjectId(req.params.id),
      })
      .then(result => {
        res.send(result);
        console.log(result.deletedCount);
      });
  });
});

//port connection
app.get("/", (req, res) => {
  res.send("Welcome to our volunteer network");
});

app.listen(process.env.PORT || port);