const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

app.use(bodyParser.json());
// places routes
app.use("/api/places", placesRoutes);
// user routes
app.use("/api/users", userRoutes);

// to handle wrong or un-registered routes
app.use((req, res, next) => {
  const error = new HttpError("Could Not Find this Routes!!", 404);
  throw error;
});
app.use((error, req, res, next) => {
  // check if  response already sent -> return next and forward the error
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown error occured" });
});
app.listen(5000);
