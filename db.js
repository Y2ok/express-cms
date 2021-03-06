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
    userIsUnique: userIsUnique,
    getUsers: getUsers,
    deleteUser: deleteUser
};

/*
** deleteUser function, for deleting a specific user
*/
function deleteUser(req, res, next) {
    // Let's try to delete user with passed id
    db.none('DELETE FROM users WHERE id = $1', req.params.id)
        .then(function (data) {
            // Return success message
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'User has been deleted'
                });
        })
        .catch(function (error) {
            // Return an error
            return next(error);
        });
}

/*
** getUsers funtion, for retrieving all users
*/
function getUsers(req, res, next) {
    db.any('SELECT users.id, users.name, users.surname, users.email, users.birthday, users.gender, roles.name as role FROM users INNER JOIN roles ON users.role_id = roles.id ORDER BY users.id DESC')
        .then(function (data) {
            // Return data
            return res.status(200)
                .json({
                    status: 'success',
                    users: data
                });
        })
        .catch(function (error) {
            // Error occured
            return next(error);
        });
}

/*
** userIsUnique function, for checking if user already exists in database
*/
function userIsUnique(req, res, next) {
    // Check if user already exists in database
    db.none('SELECT password FROM users WHERE email = $1', req.body.email)
        .then(function (data) {
            // User doesn't exist, let's register it
            registerUser(req, res, next);
        })
        .catch(function (error) {
            // User is not unique, let's return error message
            return res.status(200)
                .json({
                    status: 'errors',
                    errors: [{
                        param: 'email',
                        msg: 'E-mail address is not unique!'
                    }]
                });
        });
}

/*
** checkUserData function, for verifying if user is authorized to log in
*/
function checkUserData(req, res, next) {
    var email = req.body.email,
        password = req.body.password;

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
                            message: {
                                param: 'generalError',
                                msg: 'Incorrect e-mail or password'
                            }
                        });
                } else { // Return error message that password or e-mail is wrong
                    return res.status(200)
                        .json({
                            status: 'error',
                            message: {
                                param: 'generalError',
                                msg: 'Incorrect e-mail or password'
                            }
                        });
                }
            });
        })
        .catch(function (err) {
            // If it wasn't possible to retrieve user - return that password or e-mail is incorrect
            return res.status(200)
                .json({
                    status: 'error',
                    message: {
                        param: 'generalError',
                        msg: 'Incorrect e-mail or password'
                    }
                });
        });
}

/*
** registerUser function, for inserting user in database
*/
function registerUser(req, res, next) {
    // Let's hash and salt password
    bcrypt.hash(req.body.password, 12, function (error, hashedPass) {
        console.log(new Date());
        // If there are no issues during hashing and salting, let's try to insert user
        if (!error) {
            var user = {
                password: hashedPass,
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                birthday: req.body.birthday,
                creationDate: req.body.creationDate,
                gender: req.body.gender,
                role: 2
            };
            // Let's insert user in database
            db.none('INSERT INTO users (email, name, surname, password, birthday, creationDate, gender, role_id) VALUES (${email}, ${name}, ${surname}, ${password}, ${birthday}, ${creationDate}, ${gender}, ${role})', user)
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