const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { updateOne, deleteOne, getOne, getAll } = require('./handleFactoy');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new AppError('Please upload JPEG image', false));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.userPhotoUpload = upload.single('photo');
exports.tourImagesUpload = upload.fields([{
    name : "imageCover" , maxCount:1},
    {name : "images",maxCount:3}
])

exports.resizeUserPhoto = async (req, res, next) => {
    
  if (!req.file) return next();
    req.body.photo = `user-${req.user._id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.body.photo}`);
    next()
};
exports.resizeTourImages = async (req, res, next) => {
  if (!req.files) return next();
    req.body.images = []
    req.body.imageCover = `tour-${req.params.tourId}-${Date.now()}.jpeg`
    if(req.files.imageCover.length){

        await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);
    }
    
    if(req.files.images.length){
        await Promise.all(req.files.images.map(async (image,index)=>{
            req.body.images.push(`tour-${req.params.id}-${index+1}.jpeg`)
            return await sharp(image.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/tour-${req.params.id}-${index+1}.jpeg`);
        }))
    }
    next()
};

const filteredObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not allow to change password . Please use /update-password'
      )
    );
  }
  console.log("(req.file)",req.file)
  const filteredBody = filteredObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo = req.body.photo
  let user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User Not Found', 400));
  }

  res.status(200).json({
    status: 'success',
    message: `User Updateded Sucessfully!`,
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
// Do Not Update Password And Confirm Password

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);

// exports.getAllUsers = catchAsync( async(req,res,next) =>{

//    const users = await User.find()

//    res.status(200).json({
//     status : "success",
//     data:{
//         users
//     }
// })
// })
