var express = require('express');
var db = require('../db.js');
var router = express.Router();

/*
** Login function for checking if user is authorized to access cms
*/
router.post('/login', function (req, res, next) {
  // Validate user login data
  return db.checkUserData(req, res, next);
});

/*
** Register function for registering user in database
*/
router.post('/register', function (req, res, next) {
  // Validate user input data
  validateRegisterData(req);

  // Check for errors
  var errors = req.validationErrors();

  // If there are any - return them to UI
  if (errors) {
    return res.status(200)
      .json({
        status: 'errors',
        errors: errors
      });
  } else {
    // Let's check if user is unique
    db.userIsUnique(req, res, next)
  }
});

/*
** Validate user data
*/
function validateRegisterData(data) {
  // Validate e-mail
  data.checkBody("email", "E-mail field must contain a valid e-mail!").isEmail();

  // Validate password
  data.checkBody("password", "Password must be from 6 to 30 characters long!").isLength({ min: 6, max: 30 });

  // Validate name
  data.checkBody("name", "Name field must contain only letters!").isAlpha();
  data.checkBody("name", "Name must be from 1 to 30 characters long!").isLength({ min: 1, max: 30 });

  // Validate surname
  data.checkBody("surname", "Surname field must contain only letters!").isAlpha();
  data.checkBody("surname", "Surname must be from 1 to 30 characters long!").isLength({ min: 1, max: 30 });

  // Validate age
  data.checkBody("age", "Age must be a number between 0 and 120!").isInt({ min: 0, max: 120 });
}

module.exports = router;
