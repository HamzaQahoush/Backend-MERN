const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const dotnetenv = dotenv.config();
const mongoose = require('mongoose');
const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const PORT = process.env.PORT || 8080;
var cors = require('cors')

app.use(bodyParser.json());

app.use(cors());  


// places routes
app.use('/api/places', placesRoutes);
// user routes
app.use('/api/users', userRoutes);

// to handle wrong or un-registered routes
app.use((req, res, next) => {
  const error = new HttpError('Could Not Find this Routes!!', 404);
  throw error;
});
app.use((error, req, res, next) => {
  // check if  response already sent -> return next and forward the error

  if (res.headerSent) {
    return next(error);
  }
  console.log(error , "error");
  res.status(error.status || 500);
  res.json({ message: error.message || 'An Unknown error occured' });
});

const connection = async () => {
  try {
    await mongoose.connect(process.env.ConnectionURL);
    app.listen(PORT, async () => {
      console.log(`Server started on port ${PORT}`);
      console.log('MongoDB connected!!');
    });
  } catch (error) {
    console.log(error);
    console.log(' connection FAILED!!');
  }
};
connection();
