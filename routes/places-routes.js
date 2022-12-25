const express = require("express");

const router = express.Router();
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p3",
    title: "PETRA",
    description: "One of the most famous sky scrapers in the Jordan!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];
router.get("/:pid", (req, res, next) => {
  console.log("get request in placess");
  const place = DUMMY_PLACES.find((p) => p.id === req.params.pid);
  if (!place) {
    const error = new Error(
      `The are No Places with id = ${req.params.pid} Sorry! `
    );
    error.code = 404;
    throw error;
  }
  res.json({ place });
});
router.get("/user/:uid", (req, res, next) => {
  console.log("get request in placess");
  const userPlaces = DUMMY_PLACES.filter((u) => u.creator === req.params.uid);
  if (userPlaces.length === 0) {
    const error = new Error(`The user of id = ${req.params.uid} has no places`);
    error.code = 404;
    return next(error);
  }

  res.json({
    userPlaces,
  });
});
module.exports = router;
