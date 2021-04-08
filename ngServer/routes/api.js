const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// mongoose.Promise = global.Promise;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      dbName: "eventDB",
      user: "aamir123",
      pass: "aamir123",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("UnauthReq");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("UnauthReq");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("UnauthReq");
  }
  req.userId = payload.subject;
  console.log(req.userId);
  next();
}

router.get("/events", (req, res) => {
  let events = [
    {
      _id: "1",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "2",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "3",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "4",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "5",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "6",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
  ];
  res.json(events);
});

router.get("/special", verifyToken, (req, res) => {
  let specialEvents = [
    {
      _id: "1",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "2",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "3",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "4",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "5",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "6",
      name: "Auto Expo Special",
      description: "lorem ipsum",
      date: "2012-04-23T18:25:43.511Z",
    },
  ];
  res.json(specialEvents);
});

router.post("/register", async (req, res) => {
  let userData = req.body;
  console.log(userData);

  const userExists = await User.findOne({ email: userData.email });

  if (userExists) {
    res.status(401).send("UserExist");
  } else {
    let user = new User(userData);
    user.save((err, registeredUser) => {
      if (err) {
        console.log(err);
      } else {
        let payload = { subject: registeredUser._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      }
    });
  }
});

router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status(401).send("InvalidEmail");
      } else if (user.password !== userData.password) {
        res.status(401).send("InvalidPassword");
      } else {
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      }
    }
  });
});

router.post("/checkEmailExist", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

module.exports = router;
