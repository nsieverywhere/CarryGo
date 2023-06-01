const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true })); //important for collecting post content
app.use(express.static("public"));


app.get("/", async (req, res) => {
   res.render("index")
});
  
app.get("/login", async (req, res) => {
    res.render("login")
   });

   app.get("/signup", async (req, res) => {
    res.render("signup")
   });

   app.get("/dashboard", async (req, res) => {
    res.render("dashboard")
   });

   app.get("/settings", async (req, res) => {
    res.render("settings")
   });

app.listen(3000, () => {
    console.log("server started!");
  });