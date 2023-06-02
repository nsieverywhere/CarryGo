const mongoose = require("mongoose");
const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// create schema
const userSchema = {
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  fname: String,
  lname: String,
};

const activitySchema = {
  pickup: String,
  destination: String,
  date: String,
  userid: String,
};

const driverSchema = {
  name: String,
  age: String,
  contact: String,
};

const usermodel = mongoose.model("users", userSchema);
const activitymodel = mongoose.model("activities", activitySchema);
const drivermodel = mongoose.model("drivers", driverSchema);

mongoose.connect("mongodb://127.0.0.1/carrygo").then((err) => {
  if (err) {
    console.log("DB connected");
  } else {
    console.log("DB connected");
  }
});

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true })); //important for collecting post content
app.use(express.static("public"));
app.use(express.json());

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.get("/signup", async (req, res) => {
  res.render("signup");
});

app.get("/dashboard/:id", async (req, res) => {
  const userId = req.params.id;

  const user = usermodel.find({ _id: userId }).then(function (userdocs) {
    const driver = drivermodel.find().then(function (docs) {
      res.render("dashboard", { user: userdocs[0], drivers: docs });
    });
  });
});

app.get("/settings/:id", async (req, res) => {
  const userId = req.params.id;

  const user = usermodel.find({ _id: userId }).then(function (docs) {
    const driver = drivermodel.find().then(function (driverdocs) {

      res.render("settings", { user: docs[0], drivers: driverdocs });
      
    })
  });
});

app.get("/activity/:id", async (req, res) => {
  const userId = req.params.id;
  const user = usermodel.find({ _id: userId }).then(function (docs) {
    const activity = activitymodel.find({ userid: userId }).then(function (activitydocs) {
      const driver = drivermodel.find().then(function (driverdocs) {

        res.render("activity", { user: docs[0], activity: activitydocs, drivers: driverdocs });
      
      })
    });
  });
});

// --------post section------

// login section

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // usermodel.find()

  usermodel
    .find({ email: email })
    .then(function (docs) {
      if (docs[0] == undefined) {
        res.status(400).json({ message: "User does not exist" });
      } else {
        bcrypt.compare(password, docs[0].password, function (err, result) {
          if (result == true) {
            // res
            //   .status(200)
            //   .json({ userid: docs[0]._id, message: "Signing in" });
            res.redirect(`/dashboard/${docs[0]._id}`);

            // sending the user id back to the front end as userid
          } else {
            res.status(400).json({ message: "Password is incorrect." });
          }
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  console.log("Login Successful");
});

// Signup section
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  usermodel.find({ email: email }).then(function (doc) {
    if (doc[0] == undefined) {
      bcrypt.hash(password, saltRounds, function async(err, hash) {
        const data = new usermodel({
          username: name,
          email: email,
          password: hash,
        });

        const val = data.save();
        res.redirect("/login");
        next();
        console.log("Signup Successful");
      });
    }
  });
});

app.post("/bookride", async (req, res, next) => {
  // res.setHeader('Content-Type', 'application/json')

  const { pickup, destination, userid } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  const date = `${day}-${month}-${year}`;

  const data = new activitymodel({
    pickup: pickup,
    destination: destination,
    date: date,
    userid: userid,
  });

  const val = data.save();
  res.send("ride booked successfully");
});

app.post("/settings", async (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, saltRounds, function async(err, hash) {
    usermodel
      .findOneAndUpdate(
        { email },
        { username, email, password: hash },
        { upsert: true, new: true }
      )
      .then(function () {
        res.json({ message: 'User settings saved successfully!' });
      });
  });
});

app.listen(3000, () => {
  console.log("server started!");
});
