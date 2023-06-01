const mongoose = require("mongoose");
const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt")
const saltRounds = 10;

// create schema
const userSchema = {
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  fname: String,
  lname: String,
};

const usermodel = mongoose.model("users", userSchema);

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

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.get("/signup", async (req, res) => {
  res.render("signup");
});

app.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

app.get("/settings", async (req, res) => {
  res.render("settings");
});

// login section

app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   // usermodel.find()

   usermodel.find({ email: email })
   .then(function (docs) {
     if (docs[0] == undefined) {
       res.status(400).json({ message: "User does not exist" });
     } else {
       bcrypt.compare(password, docs[0].password, function (err, result) {
         if (result == true) {
           res
             .status(200)
             .json({ userid: docs[0]._id, message: "Signing in" });
           // sending the user id back to the front end as userid
         } else {
           res.status(400).json({ message: "Password is incorrect." });
         }
       });
     }
   })
   .catch(function (err) {
     console.log(err);
   })

   res.redirect("/dashboard");

  console.log("Login Successful");
});

// Signup section
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

   usermodel.find({ email: email }).then(function (doc) {
      if (doc[0] == undefined) {
         bcrypt.hash(password, saltRounds, function async (err, hash) {
           
            const data = new usermodel({
               username: name,
               email: email,
               password: hash,
             });
              
             const val = data.save();
             res.redirect("/login");
             next();
             console.log("Signup Successful");

        })
     }
  })
   
  
});

app.listen(3000, () => {
  console.log("server started!");
});
