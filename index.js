// load dotenv file initially always
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = new express();
const knex = require("knex");
const knexDb = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "avex_test"
  }
});
const bookshelf = require("bookshelf");
const securePassword = require("bookshelf-secure-password");
// encrypts password in db
const db = bookshelf(knexDb);
db.plugin(securePassword);
const jwt = require("jsonwebtoken");

const User = db.Model.extend({
  tableName: "login_user",
  hasSecurePassword: true
});

const parser = require("body-parser");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};
// receive user from payload id
const strategy = new JwtStrategy(options, (payload, next) => {
  // TODO: GET USER FROM DB
  User.forge({ id: payload.id })
    .fetch()
    .then(res => {
      next(null, res);
    });
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(strategy);

app.use(passport.initialize());
app.use(
  parser.urlencoded({
    extended: false
  })
);
app.use(parser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/seedUser", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send("no fields");
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    res.send("ok");
  });
});

app.post("/getToken", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send("Fields not sent");
  }
  // forge creates a new query where email = req.body.email then fetches user
  User.forge({ email: req.body.email })
    .fetch()
    .then(result => {
      if (!result) {
        return res.status(400).send("user not found");
      }
      result
        .authenticate(req.body.password)
        .then(user => {
          const payload = { id: user.id };
          const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
          res.send(token);
        })
        .catch(err => {
          return res.status(401).send({ err });
        });
    });
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: "false" }),
  (req, res) => {
    res.send("I am a protected route");
  }
);

app.get(
  "/getUser",
  passport.authenticate("jwt", { session: "false" }),
  (req, res) => {
    console.log(req.headers)
    res.send(req.user);
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
