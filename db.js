/*
** Start of DB connection setup
*/
var promise = require('bluebird');
var pgp = require('pg-promise')(options);

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
    getAllUsers: getAllUsers
};

/*
** getAllUsers function, for retrieving all users
*/
function getAllUsers(req, res, next) {
    var email       = req.body.email,
        password    = req.body.password; 
    db.any('SELECT * FROM users WHERE email = \'' + email + '\' AND password = \'' + password + '\'')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL puppies'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}