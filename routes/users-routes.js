const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require('../Middleware/file-upload')
const userConrollers = require("../Controllers/user-controller");

router.get("/", userConrollers.getAllUser);
router.post(
  "/signup",
  fileUpload.single('image'),
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
    check("password").isLength({ min: 6 }),
  ],
  userConrollers.login
);

module.exports = router;
