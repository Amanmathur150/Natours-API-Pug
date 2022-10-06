const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');
require('dotenv').config({ path: '../../.local.env' });

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.vdhpldx.mongodb.net/natours?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database Connected SuccessFully');
  })
  .catch((err) => console.log(err));

const ToursData = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));
const ReviewsData = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));
const UsersData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

const importData = async () => {
  try {
      await Tour.create(ToursData);
      await Review.create(ReviewsData);
      await User.create(UsersData,{validateBeforeSave : false});
    
      process.exit(1)
  } catch (error) {
    console.log(error);
    process.exit(1)
    throw error;
  }
};
const deleteData = async () => {
  await Tour.deleteMany();
  await Review.deleteMany();
  await User.deleteMany();
    process.exit(1)
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
