const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please Tell Us Your Name'],
  },
  email: {
    type: String,
    required: [true, 'Please Tell Us Your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false, // it will nerver show out on any output
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please provide confirm Password'],
    minlength: 8,
    validate: {
      // only work on save and create  method not on updateOne etc
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password and confirm passwords are not matched',
    },
  },
  photo: {
    type: String,
    default :"default.jpg"
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'user tole only be user, guide, lead-guide , admin!',
    },
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangeAt: {
    type: Date,
    default: new Date(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  createAt: {
    type: Date,
    default: Date.now(),
    select: false, //This Field Never shows in result if it is false
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  let resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

let User = mongoose.model('User', userSchema);

module.exports = User;
