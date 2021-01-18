const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');

// User model
const User = require("../models/user");


// GET Edit page
router.get('/', authenticate, (req, res, next) => {
  // if the cookie and session doesn't match delete cookie to force for login again
  if (req.cookies.user_sid && !req.session.passport.user) {
    res.clearCookie("user_sid");
  };
  res.render('pages/edit', {
    title: 'Edit Profile',
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    userName: req.user.userName,
    gender: req.user.gender,
    phoneNumber: req.user.phoneNumber,
    bio: req.user.bio
  });
});

// Edit user info Handler
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      gender,
      phoneNumber,
      bio
    } = req.body;

    let errors = [];

    //Check required fields
    if (!firstName || !lastName || !userName || !gender || !phoneNumber) {
      errors.push({
        msg: "Please fill in all required fields!"
      });
    }

    // Error handler
    if (errors.length > 0) {
      console.log(errors);
      res.render('pages/edit', {
        title: "register",
        errors,
        firstName,
        lastName,
        userName,
        gender,
        phoneNumber,
        bio
      });
    } else {
      // Save the changes
      await User.findByIdAndUpdate(req.session.passport.user, {
        firstName,
        lastName,
        userName,
        gender,
        phoneNumber,
        bio
      }, {
        new: true
      }, (err, user) => {
        if (err) return res.status(400).send('User does not exist');
        req.flash('success_msg', 'Your changes successfully saved');
        res.redirect('/dashboard');
      });
    }
  } catch (error) {
    errors.push({
      msg: "Something went wrong, please try again!"
    });
    res.render('pages/register', {
      title: "register",
      errors,
      firstName,
      lastName,
      userName,
      phoneNumber,
      bio
    });
  }
});

module.exports = router;