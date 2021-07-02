const router = require("express").Router();
let bcrypt = require("bcryptjs");
let UserModel = require("../models/User.model");

/* GET home page */
router.get("/login", (req, res, next) => {
  res.render("./auth/login.hbs");
});
  
router.get("/signup", (req, res, next) => {
  res.render("./auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password, favoritefish } = req.body;

  if (!username || !password || !favoritefish) {
    res.render("auth/signup.hbs", { error: "Please enter all fields" });
    //to tell JS to come our off this function
    return;
  }

  let regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!regularExpression.test(password)) {
    res.render("./auth/signup.hbs", {
      error:
        "Invalid password, the valid password should have 6-16 characters and with at least one speail character",
    });
    // To tell JS to come out off this function
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  UserModel.create({ username, password: hash, favoritefish })
    .then(() => res.redirect("/"))
    .catch((err) => {
      next(err);
    });
});

router.post("/login", (req, res, next) => {
  const { username, password, favoritefish } = req.body;

  UserModel.findOne({ username })
    .then((user) => {
      let isValide = bcrypt.compareSync(password, user.password);
      if (isValide) {
        res.redirect("/profile");
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/profile", (req, res, next) => {
  res.render("./auth/profile.hbs");
});

module.exports = router;