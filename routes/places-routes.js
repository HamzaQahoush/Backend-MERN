const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const placeController = require("../Controllers/place-controller");
const { getPlaceById, getPlaceByUser, createPlace, updatePlace, deletePlace } =
  placeController;

router.get("/:pid", getPlaceById);
router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  createPlace
);
router.patch(
  "/:pid",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  updatePlace
);
router.delete("/:pid", deletePlace);

router.get("/user/:uid", getPlaceByUser);
module.exports = router;
