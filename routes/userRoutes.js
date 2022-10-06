const express = require('express');
const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authControllers');
const {
  updateMe,
  deleteMe,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  getMe,
  userPhotoUpload,
  resizeUserPhoto
} = require('../controllers/userControllers');

let userRoute = express.Router();


userRoute.post('/signup', signup);
userRoute.post('/login', login);
userRoute.post('/forgot-password', forgotPassword);
userRoute.patch('/reset-password/:token', resetPassword);



userRoute.use(protect)

userRoute.get('/', getAllUsers);
userRoute.patch('/update-password',  updatePassword);
userRoute.patch('/update-me',  userPhotoUpload ,resizeUserPhoto,updateMe);
userRoute.delete('/delete-me',  deleteMe);
userRoute.get('/me',  getMe, getUser);

userRoute
  .route('/:id')
  .delete(restrictTo('admin'), deleteUser)
  .patch(restrictTo('admin'), updateUser)
  .get(getUser);

module.exports = userRoute;
