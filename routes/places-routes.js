const express = require("express");
const router = express.Router();
const placeController = require("../Controllers/place-controller");
const { getPlaceById, getPlaceByUser, createPlace,updatePlace ,deletePlace} = placeController;

router.get("/:pid", getPlaceById);
router.patch("/:pid", updatePlace);
router.delete("/:pid", deletePlace);

router.get("/user/:uid", getPlaceByUser);
router.post('/',createPlace)
module.exports = router;
