/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 */

// ExpressJS App
var express = require('express');
var app = express();   

// Setup Mongoose database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

// Connect to the MongoDB instance
mongoose.connect('mongodb://127.0.0.1/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) 
// do all the work for us.
app.use(express.static(__dirname));
/**
 * The __dirname is a global variable that represents the directory name of the current module.
 * So, when a client makes a request for a file, the Express application will check the current 
 * directory for the file and return it to the client if it exists. 
 */


app.get('/', function (request, response) {
    console.log('Simple web server of files from ' + __dirname);
    response.send('Simple web server of files from ' + __dirname);
});


/*
 * Use Express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count; // adding count property into collections's element
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};  // count obj
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count; 
                    // assign each count value into the count obj
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});


/*
 * Jian Zhong
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {

    User.find({}, function(err, users) {
        // Error handling
        if (err) {
            console.log("** Get user list: Error! **");
            response.status(500).send(JSON.stringify(err));
        } else {
            /**
             * "user" returned from Mongoose is Array type: Array of user objects.
             * also need to be processed as Mongoose models and models from frontend do not allign perpectly.
             */
            console.log("** Read server path /user/list Success! **");
            const userList = JSON.parse(JSON.stringify(users));    // convert Mongoose data to Javascript obj

            /**
             * * async method with "async.each()"
             */
            // const newUserList = [];
            // async.each(userList, (user, doneCallback) => {
            //     const { first_name, last_name, _id } = user;
            //     newUserList.push({ first_name, last_name, _id }); 
            //     doneCallback(err);
            //     console.log("From async: ", newUserList);
            // }, error => {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         response.json(newUserList);
            //     }
            // });

            /**
             * * non-async method
             * Get only wanted user proeprties from Database's model, 
             * and construct a new users obj to response.
             */
            const newUsers = userList.map(user => {
                const { first_name, last_name, _id } = user;
                return { first_name, last_name, _id };
            });

            // Send response to client
            response.json(newUsers);
        }
    });

});


/*
 * Jian Zhong
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    const id = request.params.id;

    /**
     * Finding a single user from user's ID
     */
    User.findOne({_id: id}, function(err, user) {
        if (err) {
            console.log(`** User ${id}: Not Found! **`);
            response.status(400).send(JSON.stringify(err));
        } else {
            console.log(`** Read server path /user/${id} Success! **`);
            const userObj = JSON.parse(JSON.stringify(user)); // convert mongoose data to JS data
            delete userObj.__v;                               // remove unnecessary property
            response.json(userObj);
        }
    });
});


/**
 * * Jian Zhong 
 * * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;

    /**
     * Finding a single user from user's ID
     */
    Photo.find({user_id: id}, (err, photos) => {
        if (err) {
            console.log(`** Photos for user with id ${id}: Not Found! *`);
            response.status(400).send(JSON.stringify(`** Photos for user with id ${id}: Not Found **`));
        } else {
            console.log(`** Read server path /photosOfUser/${id} Success! **`);
            let count = 0;                                        // count the number of processed photos 
            const photoList = JSON.parse(JSON.stringify(photos)); // get data from server and convert to JS data

            // For each photo in photos list:
            photoList.forEach(photo => {
                delete photo.__v;  // remove the unnessary property before sending to client.

                // For each comment in comments list: 
                /**
                 * ! To fecth multiple modules, need to use async.each().
                 */
                async.eachOf(photo.comments, (comment, index, callback) => {
                    // Use comment's user_id to get user object and update comment's user property.
                    User.findOne({_id: comment.user_id}, (error, user) => {
                        if (!error) {
                            const userObj = JSON.parse(JSON.stringify(user)); // parse retrieved Mongoose user data
                            const {location, description, occupation, __v, ...rest} = userObj; // only keep (_id, first_name, last_name) properties
                            photo.comments[index].user = rest;      // update the user obj to each comment's user property.
                            delete photo.comments[index].user_id;   // remove unnessary property for each comment
                        }
                        callback(error);
                    });
                }, error => {
                    count += 1;
                    if (error) {
                        response.status(400).send(JSON.stringify(`** Photos for user with id ${id}: Not Found **`));
                    } else if (count === photoList.length) {
                        // Response to client only after aysnc.each() has processed all Photos in photoList.
                        console.log("Done all  async() processing");
                        response.json(photoList);  // Response to client, finanly!
                    }
                }); // end of "async.eachOf(photo.comments,)"
            }); // end of "photoList.forEach(photo)"

        }
    });    
});



var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
