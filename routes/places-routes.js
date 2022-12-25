const express = require("express");
const router = express.Router();
const placeController = require("../Controllers/place-controller");
const { getPlaceById, getPlaceByUser } = placeController;

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlaceByUser);

module.exports = router;
