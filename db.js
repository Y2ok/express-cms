/*
** Start of DB connection setup
*/
var promise = require('bluebird');
var pgp = require('pg-promise')(options);
var bcrypt = require('bcrypt');

var options = {
    promiseLib: promise
};

var cn = {
    host: 'localhost', // host for db server
    port: 5432, // port for db server
    database: 'ng-cms', // database in which angular 2 cms tables are located
    user: 'postgres', // user with whom we will connect to database
    password: 'root' // password for the user
};

// Create connection
var db = pgp(cn);

/*
** End of DB connection Setup
*/

// export all db functions
module.exports = {
    checkUserData: checkUserData,
    registerUser: registerUser,
    userIsUnique: userIsUnique
};

/*
** userIsUnique function, for checking if user already exists in database
*/
function userIsUnique(req) {
    // Check if user already exists in database
    db.none('SELECT password FROM users WHERE email = $1', req.body.email)
        .then(function (data) {
            // User doesn't exist, all good
            return true;
        })
        .catch(function (err) {
            // User exists, let's return an error message
            return false;
        });
}

/*
** checkUserData function, for verifying if user is authorized to log in
*/
function checkUserData(req, res, next) {
    var email = req.body.email,
        password = req.body.password;

    // Compare passed data with db data
    compareData(email, password, res, next);
}

/*
** registerUser function, for inserting user in database
*/
function registerUser(req, res, next) {
    // Let's hash and salt password
    bcrypt.hash(req.body.password, 12, function (error, hashedPass) {
        // If there are no issues during hashing and salting, let's try to insert user
        if (!error) {
            var user = {
                password: hashedPass,
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                age: req.body.age,
                gender: req.body.gende
            };
            // Let's insert user in database
            db.none('INSERT INTO users (email, name, surname, password, sex, age) VALUES (${email}, ${name}, ${surname}, ${password}, ${gender}, ${age})', user)
                .then(function () {
                    res.status(200)
                        .json({
                            status: 'success',
                            message: 'User has been registered!'
                        });
                })
                .catch(function (error) {
                    return next(error);
                });
        }
    });
}

/*
** compareData function, for comparing passed and db data
*/
function compareData(email, password, res, next) {
    // Let's retrieve user by e-mail
    db.one('SELECT password FROM users WHERE email = $1', email)
        .then(function (data) {
            // If we retrieved user, let's compare it's password
            bcrypt.compare(password, data.password, function (error, result) {
                // If true, then let's return success message
                if (result) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            message: 'Login has been successful!'
                        });
                } else { // Return error message that password or e-mail is wrong
                    return res.status(200)
                        .json({
                            status: 'error',
                            message: 'Incorrect e-mail or password'
                        });
                }
            });
        })
        .catch(function (err) {
            // If it wasn't possible to retrieve user - return that password or e-mail is incorrect
            return res.status(200)
                .json({
                    status: 'error',
                    message: 'Incorrect e-mail or password'
                });
        });
}
