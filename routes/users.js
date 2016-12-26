var express = require('express');
var db = require('../db.js');
var router = express.Router();

/*
** Retrieve all users with their data
*/
router.get('/getUsers', function (req, res, next) {
  // Retrieve user data
  return db.getUsers(req, res, next);
});

/*
** Delete a specific user
*/
router.delete('/deleteUser/:id', function(req, res, next) {
    // Try to delete user from database
    return db.deleteUser(req, res, next);
})

module.exports = router;
