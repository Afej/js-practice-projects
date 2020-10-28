const { body, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");

module.exports = {
  requireEmail: body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already in use!");
      }
    }),
  requirePassword: body("password").trim().isLength({ min: 4, max: 20 }),
  requirePassword2: body("password2")
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((password2, { req }) => {
      if (password2 !== req.body.password) {
        throw new Error("Passwords must match!");
      }
    }),
};
