const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const placesRoutes = require("./routes/places-routes");

app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  // check if  response already sent -> return next and forward the error
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown error occured" });
});
app.listen(5000);
