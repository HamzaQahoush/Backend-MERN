const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
let DUMMY_PLACES = [
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

const getPlaceByUser = (req, res, next) => {
  const userPlaces = DUMMY_PLACES.filter((u) => u.creator === req.params.uid);
  if (userPlaces.length === 0) {
    return next(
      new HttpError(`The user of id = ${req.params.uid} has no places`, 404)
    );
  }

  res.json({
    userPlaces,
  });
};

const getPlaceById = (req, res, next) => {
  const place = DUMMY_PLACES.find((p) => p.id === req.params.pid);
  if (!place) {
    next(
      new HttpError(
        `The are No Places with id = ${req.params.pid} Sorry! `,
        404
      )
    );
  }
  res.json({ place });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    next(
      new HttpError(
        `invalid inputs passed for ${param}, please check your input`,
        422
      )
    );
  }

  const { title, address, imageUrl, description, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
    console.log("coordinates>>>>>>>>>.", coordinates);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuid.v4(),
    title,
    address,
    imageUrl,
    location: coordinates,
    description,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    throw new HttpError(
      `invalid inputs passed for ${param}, please check your input`,
      422
    );
  }
  const { title, imageUrl, description } = req.body;
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  DUMMY_PLACES[placeIndex] = {
    ...DUMMY_PLACES[placeIndex],
    title: title,
    imageUrl: imageUrl,
    description: description,
  };
  const updated = DUMMY_PLACES[placeIndex];
  res.status(200).json({ place: updated });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("could not find a place for this id", 404);
  }

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  DUMMY_PLACES.splice(placeIndex, 1);
  res.status(200).json({ msg: `Success!! Deleted for place id = ${placeId}` });
};
module.exports = {
  getPlaceById,
  getPlaceByUser,
  createPlace,
  updatePlace,
  deletePlace,
};
