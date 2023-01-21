const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
const dotnetenv = dotenv.config();
const mongoose = require('mongoose');
const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const PORT = process.env.PORT || 8080;
var cors = require('cors');
const path = require('path');
app.use(bodyParser.json());
app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//   next();
// });
app.use(
  '/home/hamza/Backend-mern/uploads/images',
  express.static(
    path.join('uploads', 'images')
  )
  
);

// places routes
app.use('/api/places', placesRoutes);
// user routes
app.use('/api/users', userRoutes);

// to handle wrong or un-registered routes
app.use((req, res, next) => {
  const error = new HttpError('Could Not Find this Routes!!', 404);
   return next (error);
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.files.path, (err) => {
      console.log(err);
    });
  }
  // check if  response already sent -> return next and forward the error

  if (res.headerSent) {
    return next(error);
  }
  console.log(error, 'error');
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
