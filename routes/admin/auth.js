const express = require("express");
const { body, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signupTemp = require("../../views/admin/auth/signup");
const signinTemp = require("../../views/admin/auth/signin");

const {
  requireEmail,
  requirePassword,
  requirePassword2,
} = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemp({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePassword2],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemp({ req, errors }));
    }

    const { email, password, password2 } = req.body;

    const newUser = await usersRepo.create({ email, password });

    req.session.userId = newUser.id;

    // res.send("Account created!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out!");
});

router.get("/signin", (req, res) => {
  res.send(signinTemp());
});

router.post(
  "/signin",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must provide a valid email")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });
        if (!user) {
          throw new Error("Email not found!");
        }
      }),
    body("password").trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    console.log(errors);

    const { email, password } = req.body;

    const validPassword = await usersRepo.comparePasswords(
      user.password,
      password
    );
    if (!validPassword) {
      return res.send("Invalid password!");
    }

    req.session.userId = user.id;

    res.send("You are signed in!");
  }
);

module.exports = router;
