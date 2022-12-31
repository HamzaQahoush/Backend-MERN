const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

const getPlaceByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let userPlaces;
  try {
    userPlaces = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError(`Fetching places failed, please try agian later `, 500)
    );
  }
  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError(`The are No Places with id = ${userId} Sorry! `, 404)
    );
  }

  res.json({ place: userPlaces.map((p) => p.toObject({ getters: true })) });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError(`The are No Places with id Sorry! `, 404));
  }
  if (!place) {
    return next(
      new HttpError(
        `The are No Places with id = ${req.params.pid} Sorry! `,
        404
      )
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
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

  const { title, address, image, description, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    address,
    image,
    location: coordinates,
    description,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    console.log(err);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let updatedPlace;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    throw new HttpError(
      `invalid inputs passed for ${param}, please check your input`,
      422
    );
  }
  const { title, image, description } = req.body;

  try {
    updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      { title: title, image: image, description: description },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (err) {
    return next(
      new HttpError("something went wrong , Can't update the place", 500)
    );
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.deleteOne({ _id: placeId });
  } catch (err) {
    return next(
      new HttpError("something went wrong , Can't delete the place", 500)
    );
  }
 

  res.status(200).json({ msg: `Success!! Deleted for place id = ${placeId}` });
};
module.exports = {
  getPlaceById,
  getPlaceByUser,
  createPlace,
  updatePlace,
  deletePlace,
};
