const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const express = require("express");
const mongodb = require("mongodb");
const cookie = require("cookie-session");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();

const clientID = "66f056183e981d1a11b2";

app.use(helmet());

app.use(serveStatic("build", { index: ["index.html"] }));

app.use(
  cookie({
    name: "session",
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
  })
);

app.use(favicon(path.join(__dirname, "build", "favicon.ico")));

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
      callbackURL: "http://localhost:8080/github/callback",
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

//we might be able to skip redirecting, i think i was just playing around during a3
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
  res.redirect("/");
});

app.use(express.static("build"));
app.use(express.json());

const uri =
  "mongodb+srv://" +
  process.env.DB_USERNAME +
  ":" +
  process.env.DB_PASSWORD +
  "@cluster0.yb8hn.mongodb.net/";

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

app.get("/favorites", (req, res) => {
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
  dataJSON.userID = req.session.id;
  collection
    .findOne({
      // data to check if favorite already exists we can figure this out later
      userID: dataJSON.userID,
    })
    .then(function (result) {
      return result;
    })
    .then(function (data) {
      if (data === null) {
        collection.insertOne(dataJSON).then((result) => res.json(result));
      } else {
        collection
          .replaceOne(
            {
              name: dataJSON.name,
              team: dataJSON.team,
              userID: dataJSON.userID,
            },
            dataJSON
          )
          .then((result) => res.json(result));
      }
    });
});

app.post("/remove", (req, res) => {
  // removes an instance matching request body
  collection.deleteOne(req.body).then((result) => res.json(result));
});

app.listen(8080);
