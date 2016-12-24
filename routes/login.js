var express = require('express');
var db = require('../db.js');
var router = express.Router();

/*
** Login function for checking if user is authorized to access cms
*/
router.get('/', function (req, res, next) {
  db.getAllUsers(req, res, next);
});

module.exports = router;
