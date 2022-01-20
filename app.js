//* Importing Modules
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import "dotenv/config";

//* Initializing express
const app = express();

//* Middlewares
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//* Mongooose Connection
mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
});

//* Schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//* Plugin
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

//* Models
const User = new mongoose.model("User", userSchema);

//* App GET routes
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//* App POST routes
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

//* Server Port
app.listen(3000, function () {
  console.log("Server is up and running on 3000");
});
