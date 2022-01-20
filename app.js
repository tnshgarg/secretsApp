//* Importing Modules
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";

//* Initializing express and declaring salt rounds
const app = express();
const saltRounds = 10;

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
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
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
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

//* Server Port
app.listen(3000, function () {
  console.log("Server is up and running on 3000");
});
