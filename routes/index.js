const fs = require('fs');
const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const authenticate = require('../config/auth');

// User model
const User = require("../models/user");
const Article = require("../models/article");

// GET home page
router.get('/', (req, res, next) => {
  // render the page for client
  res.render('pages/home', {
    title: 'MHD App'
  });
});

// GET Dashboard page
router.get('/dashboard', authenticate, (req, res, next) => {
  // if the cookie and session doesn't match delete cookie to force for login again
  if (req.cookies.user_sid && !req.session.passport.user) {
    res.clearCookie("user_sid");
  };
  // if the user is admin
  User.findById(req.session.passport.user, (err, user) => {
    console.log(user.role);
    if (user.role === 'admin') {
      res.render('pages/adminDashboard', {
        title: 'Admin Dashboard',
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        gender: req.user.gender,
        phoneNumber: req.user.phoneNumber,
        createdAt: req.user.createdAt,
        bio: req.user.bio,
        avatar: req.user.avatar
      });
    } else {
      // render the page for client with information the page need
      res.render('pages/dashboard', {
        title: 'Dashboard',
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        gender: req.user.gender,
        phoneNumber: req.user.phoneNumber,
        createdAt: req.user.createdAt,
        bio: req.user.bio,
        avatar: req.user.avatar
      });
    }
  })


});

// Config storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const uploadAvatar = multer({
  storage: storage
});

// Handle avatar upload
router.post('/uploadAvatar', authenticate, (req, res) => {
  const upload = uploadAvatar.single('avatar');

  upload(req, res, (err) => {
    if (err) return res.status(400).send('err');
    console.log(req.file);
    if (req.file === undefined) {
      let errors = [];
      errors.push({
        msg: "Please choose a file to upload!"
      });
      res.render('pages/dashboard', {
        title: 'Dashboard',
        errors,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        gender: req.user.gender,
        phoneNumber: req.user.phoneNumber,
        createdAt: req.user.createdAt,
        bio: req.user.bio,
        avatar: req.user.avatar
      });
    } else {
      User.findById(req.session.passport.user, (err, user) => {
        if (user.avatar) {
          console.log('avatar exist:', user.avatar);
          fs.unlinkSync(`public/images/${user.avatar}`);
        };
      });
      User.findByIdAndUpdate(req.session.passport.user, {
        avatar: req.file.filename
      }, {
        new: true
      }, (err, user) => {
        if (err) return res.status(400).send('User does not exist');
        req.session.passport.user.avatar = req.file.filename;
        req.flash('success_msg', 'Your avatar successfully saved');
        res.redirect('/dashboard');
      });
    };

  });
});

// GET user articles page
router.get('/user/articles', authenticate, (req, res, next) => {
  // if the cookie and session doesn't match delete cookie to force for login again
  if (req.cookies.user_sid && !req.session.passport.user) {
    res.clearCookie("user_sid");
  };
  // find all articles of user
  Article.find({
    author: req.session.passport.user
  }, (err, articles) => {
    if (err) return res.status(400).send('Something went wrong');
    // render the page for client with information the page need
    res.render('pages/articles', {
      title: 'Your Articles',
      avatar: req.user.avatar,
      articles
    });
  })
});

// GET all articles page
router.get('/all/articles', authenticate, (req, res, next) => {
  // if the cookie and session doesn't match delete cookie to force for login again
  if (req.cookies.user_sid && !req.session.passport.user) {
    res.clearCookie("user_sid");
  };
  // find all articles of user
  Article.find({}, (err, articles) => {
    if (err) return res.status(400).send('Something went wrong');
    // render the page for client with information the page need
    res.render('pages/articles', {
      title: 'All Articles',
      avatar: req.user.avatar,
      articles
    });
  })
});

module.exports = router;