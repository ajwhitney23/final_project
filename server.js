const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const express = require("express");
const mongodb = require("mongodb");
const cookie = require("cookie-session");
const serveStatic = require("serve-static");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

const clientID = "a93f32b8cd47d1dedbff";

app.use(serveStatic(path.join(__dirname, "static")));
app.use(express.static("build"));
app.use(express.json());

app.use(
  cookie({
    name: "session",
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: clientID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// authentication handling using passport
app.get("/auth/error", (req, res) => res.send("Unknown Error"));
app.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/error" }),
  function (req, res) {
    res.redirect("/res?id=" + req.user.id);
  }
);

app.get("/res", (req, res) => {
  req.session.id = req.query.id;
  res.redirect("/");
});

app.get("/id", (req, res) => {
  res.send(req.session.id);
});

app.get("/logout", (req, res) => {
  req.session.id = "";
  req.logout();
  res.status(200).send("Logout Successful");
});

const uri =
  "mongodb+srv://" +
  process.env.DB_USERNAME +
  ":" +
  process.env.DB_PASSWORD +
  "@group8data.ehg8z.mongodb.net/";

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("gameapi").collection("favorites");
  })
  .then((__collection) => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  });

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/prefs", (req, res) => {
  if (collection !== null) {
    collection
      .find({ userID: req.session.id })
      .toArray()
      .then((result) => res.json(result));
  }
});

app.post("/submit", (req, res) => {
  // assumes only one object to insert
  const dataJSON = req.body;
  console.log(req.body);
  if (req.session.id === "") {
    res.status(500).send("No User Logged In");
    return;
  }
  dataJSON.userID = req.session.id;
  collection
    .findOne({
      userID: dataJSON.userID,
    })
    .then(function (result) {
      return result;
    })
    .then(function (data) {
      if (data === null) {
        collection
          .insertOne(dataJSON)
          .then((result) => res.status(200).json(result));
      } else {
        collection
          .replaceOne(
            {
              userID: dataJSON.userID,
            },
            dataJSON
          )
          .then((result) => res.status(200).json(result));
      }
    });
});

app.post("/remove", (req, res) => {
  // removes an instance matching request body
  collection.deleteOne(req.body).then((result) => res.json(result));
});

const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
