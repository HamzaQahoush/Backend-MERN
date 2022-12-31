const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const userConrollers = require("../Controllers/user-controller");

router.get("/", userConrollers.getAllUser);
router.post(
  "/signup",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("name").notEmpty(),
  ],
  userConrollers.signup
);
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  userConrollers.login
);

module.exports = router;
