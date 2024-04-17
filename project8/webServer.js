/* jshint node: true */

/*
 * The command "node webServer.js" starts the web server and connects to a MongoDB instance 
 * on the localhost at the standard port address. 
 * 
 * The URL http://localhost:3000/photo-share.html should start the app.
 * 
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 * 
 */


/**
 * Setup Mongoose database and connect:
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Setup Locking Mechanisms for updating like/unlike votes
 */
const { Mutex } = require('async-mutex');
const mutex = new Mutex();


/**
 * Setup necessary parsers middlewares:
 *  */ 
const session = require('express-session'); // for handling session management
const bodyParser = require('body-parser');  // for parsing the JSON encoded POST request bodies
const multer = require('multer');           // for handling uploading photos
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');     // accept a single file with the name "uploadedphoto". The single file will be stored in req.file.
var MongoStore = require('connect-mongo')(session);
const fs = require("fs"); // for writing files into the filesystem


/**
 *  Setup ExpressJS App
 *  */
var express = require('express');
var app = express();   
var async = require('async'); // to use async.each()
const { is } = require('bluebird');

/**
 * * Proejct 7 Extra Credit
 * Import hash and salt functions for passwords
 */
const { makePasswordEntry, doesPasswordMatch } = require('./cs142password');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
const { format } = require('path');


// We have the express static module (http://expressjs.com/en/starter/static-files.html) 
// do all the work for us.
/**
 * The __dirname is a global variable that represents the directory name of the current module.
 * So, when a client makes a request for a file, the Express application will check the current 
 * directory for the file and return it to the client if it exists. 
 */
app.use(express.static(__dirname));


/**
 * * Jian Zhong: Project 7, Setup Express Session
 * Setup Session Store
 * use the MongoStore for storaging Session
 */
app.use(session({
    secret: 'secretKey', 
    resave: false,            // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new MongoStore({ mongooseConnection: mongoose.connection })
})); 


/**
 * Middleware to parse application/json
 *  */ 
app.use(bodyParser.json());  


/**
 * * Jian Zhong: Project 7, problem 1's endpiont
 * API for loggging in a user
 * Provides a way for the photo app's LoginRegister view to login in a user
 */
app.post('/admin/login', (request, response) => {
    /**
     * See if the request's loginName matches database
     * if match, send back greeting to client
     * if not match, send 400 status code(Bad Request).
     */
    User.findOne({ login_name: request.body.login_name })
        .then(user => {
            if (!user) {
                // Verify valid account
                console.log("Does not exist the user");
                response.status(400).json({ message: `Account "${request.body.login_name}" does not exist, please try again` });
            } 
            else if ( !doesPasswordMatch(user.password_digest, user.salt, request.body.passwordClearText) ) {
                // Verify the password 
                console.log("Password wrong");
                response.status(400).json({ message: `Password is not correct, please try again` });
            }
            else {
                // Login OK! Reply with information for logged in user
                console.log(`** Server: User logined: ${request.body.login_name}`);
                const userObj = JSON.parse(JSON.stringify(user));        // * convert mongoose data to JS data, needed for retrieving data from Mongoose!
                request.session.sessionUserID = userObj._id;              // save login user id to session to have browser remember the current user
                request.session.sessionUserFirstName = userObj.first_name;// save login user first name to session to have browser remember the current user
                request.session.sessionUserLastName = userObj.last_name; // save login user last name to session
                response.status(200).json({ first_name: userObj.first_name, 
                                            last_name: userObj.last_name,
                                            id: userObj._id });         // reply back with login user {first_name:, id:}     
            }
        })
        .catch(error => {
            console.error(`** Error occured: ${error}. **`);
            response.status(400).json({ message: "Other error occured" });
        });
});


/**
 * * Jian Zhong: Project 7, API for logging out in a user
 * A POST request with an empty body to this URL will logout the user by clearing the information stored in the session. 
 * An HTTP status of 400 (Bad request) should be returned in the user is not currently logged in
 */
app.post('/admin/logout', (request, response) => {
    // return status code 400 if user is currently not logged in
    if (!request.session.sessionUserID) {
        response.status(400).json({ message: "User is not logged in" });
        console.log("You already logged out, no need to do again.");
    } else {
        // clear the information stored in the session
        request.session.destroy(err => {
            // return status code 400 if error occurs during destroying session
            if (err) {
                console.log("Error in destroying the session");
                response.status(400).send();
            }
            else {
                // Delete session successfully, send 200 code!
                console.log("OK");
                response.status(200).send();
            }
        });
    }
});

/**
 * * Jian Zhong: Project 7, problem 1 login and logout
 * * Function to check if the user is logged,
 * * only logged user can continue next step.
 * @param request 
 * @param response 
 * @param next 
 */
function hasSessionRecord(request, response, next) {
    if (request.session.sessionUserID) {
        next(); // continue to next step
    }
    else {
        console.log("Session: the user is not logged in.");
        response.status(401).send('The user is not logged in.');
    }
}


/**
 * * Jian Zhong: Project 7, problem 4's endpoint 
 * To deal with new user registration
 */
app.post('/user', (request, response) => {
    const newUser = request.body;

    // Check: the first_name, last_name, and password must be non-empty strings
    if ( !(newUser.first_name && newUser.last_name &&  newUser.passwordClearText) ) {
        response.status(400).json({ message: "The first_name, last_name, and password must be non-empty strings" });
        return;
    }

    // Check if there is an existing user login name, if not then create new user
    User.findOne({ login_name: newUser.login_name })
        .then(user => {
            if (!user) { // user not exists yet
                console.log("Storing the new user in DB...");

                // replace user cleartext password with salted password digest
                const passwordEntry = makePasswordEntry(newUser.passwordClearText);
                newUser.password_digest = passwordEntry.hash;
                newUser.salt = passwordEntry.salt;
                delete newUser.passwordClearText; // discard the password for safety
                console.log(newUser);

                // create the user in the DB
                User.create(newUser)
                    .then(() => console.log("New User created in the DB"))
                    .catch(e => console.log("Error creating new user ", e));

                // send response
                response.status(200).json({ message: "User created successfully!" });
            } else { // user exists already
                console.log("User already exists!");
                console.log(user);
                response.status(400).json({ message: "The login name already exists, please choose a different login name"});
            }
        })
        .catch(error => {
            console.log("Error: user found user error", error);
            response.status(400).json({ message: "Other error occured: " });
        });
});

/**
 * * Jian Zhong: Project 7, problem 3's endpoint 
 * Handle photo uploading:
 * const upload = multer({ storage: multer.memoryStorage() }); // to handle multipart/form-data
 * const processFormBody = upload.single('uploadedphoto');     // accept a single file with the name "uploadedphoto". The single file will be stored in req.file.
 */
app.post('/photos/new', hasSessionRecord, (request, response) => {

    processFormBody(request, response, err => {
        // Check if request has any errors:
        if (err || !request.file) {
            console.log("Error in processing photo received from request", err);
            return;
        }

        // Check if uploaded photo is empty
        if (request.file.buffer.size === 0) {
            request.status(400).json({ message: 'Error: Uploaded photo is empty' });
            return;
        }        

        // Create the file in the directory "images" under an unique name, 
        // make the original file name unique by adding a unique prefix with a timestamp,
        // then have the photo data written into the images directory
        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;
        fs.writeFile(`./images/${filename}`, request.file.buffer, function (error) {
            if (error)  console.log("Error during photo data writting into the images directory: ", error);
            else console.log("** Server: photo saved in the directory **");
        });

        // Under the name filename, store the new Photo object in the database
        Photo.create(
            {
                file_name: filename,
                date_time: timestamp,
                user_id: request.session.sessionUserID,
                comments: [],
                likes: [],
            }, 
            function(error, newPhoto) {
                if (error) {
                    response.status(400).send("unable to create new photo");
                }
                newPhoto.save();
                response.status(200).send();  // must send back succeed response
            }
        );
    });
});


/**
 * * Jian Zhong: Project 7, problem 2's endpoint 
 * Handle new comment:
 * store the new comment in the database
 */
app.post('/commentsOfPhoto/:photo_id', hasSessionRecord, (request, response) => {
    // check empty response
    if (Object.keys(request.body).length === 0) { 
        response.status(400).json({ message: "Server: empty comment is not allowed" });
        return;
    }

    const commentText = request.body.comment;    // new comment 
    const photoID = request.params.photo_id;     // photo's id

    // find the photo being commented: comment's photo_id and photo's _id is the same
    Photo.findOne({ _id: photoID })
         .then(photo => {
            if (!photo) {
                // handle not found
                response.status(400).json({ message: "Server: Photo you just commented is not found" });
            } else {
                // handle found photo
                const commentObj = {
                    comment: commentText, 
                    date_time: new Date().toISOString(),
                    user_id: request.session.sessionUserID // logged user id is the session user id
                };
                // initiazlie a new photo comment list or add to an existing list
                if (!photo.comments) photo.comments = [commentObj];
                else photo.comments.push(commentObj);
                photo.save();
                console.log("** Server: a new comment added! **");
                response.status(200).send(); // send back succeed response
            }
         })
         .catch(error => {
            response.status(400).json({ message: "Other error occured: " });
            console.error('Server: Error Finding Photo with Photo ID', error);
         });
});



app.get('/', hasSessionRecord, function (request, response) {
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
app.get('/test/:p1', hasSessionRecord, function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
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
 * * solved wating for /user/list response forever:
 * * because of isAuthenticated() middleware,
 * * requst to this path will hang forever.
 */
app.get('/user/list', hasSessionRecord ,function (request, response) {
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
            console.log("** Server: found all users Success! **");
            const userList = JSON.parse(JSON.stringify(users));    // convert Mongoose data to Javascript obj
            
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
            response.status(200).json(newUsers);            
        }
    });
});

/*
 * Jian Zhong
 * for formatting date time into a more readable format
 * Example of dateTimeString: '2010-08-30T21:26:00.000Z'
 * Example of return: 'Aug 30, 2010, 02:26 PM'
 */
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    // Format the date for display
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    return dateTimeFormat.format(dateTime);
}


app.get('/user/:id', hasSessionRecord, function (request, response) {
    /**
     * Finding a single user from user's ID
     */
    const userID = request.params.id;

    User.findOne({_id: userID})
        .then(user => {
            if (!user) {
                // handle not found
                console.log(`** User ${userID}: Not Found! **`);
            } else {
                // handle found
                const userObj = JSON.parse(JSON.stringify(user)); // convert mongoose data to JS data
                delete userObj.__v;                               // remove unnecessary property
                userObj.logged_user_first_name = request.session.sessionUserFirstName; // save logged user first name for TopBar
                userObj.logged_user_last_name = request.session.sessionUserLastName;
                userObj.logged_user_id = request.session.sessionUserID;
                response.status(200).json(userObj); // response the data back to the frontend browser
            }
        })
        .catch(error => {
            console.log(`** From "/user/:id": User ${userID}: Not Found! **`,  error.message);
            response.status(400).json({ message: error.message });
        });
});


/*
 * Jian Zhong
 * URL /user/:id - Return the information for User (id)
 * Used by userDetail.jsx
 */
app.get('/user2/:id', hasSessionRecord, async function (request, response) {
    const userID = request.params.id;
  
    try {
      /** 
       * * Noted: By using await, subsequent lines of code 
       * * after the await expression will not execute 
       * * until the awaited promise resolves or rejects.
       */
      const user = await User.findOne({ _id: userID });
  
      // handle not user found
      if (!user) {
        console.log(`** User of ${userID}: Not Found! **`);
        return response.status(404).json({ message: `User not found` });
      }
  
      // handle found user
      const userObj = JSON.parse(JSON.stringify(user)); // Convert Mongoose object to a plain JavaScript object
      delete userObj.__v; // remove unnecessary property
      userObj.logged_user_first_name = request.session.sessionUserFirstName; // save logged user first name for TopBar
      userObj.logged_user_last_name = request.session.sessionUserLastName;
      userObj.logged_user_id = request.session.sessionUserID;
      console.log(`** Server: login user: ${userObj.logged_user_first_name} found! **`);
  
      // Get most recent photo and most commented photo
      const photosData = await Photo.find({ user_id: userID });

      // handle not photo found (user has not posted any photos yet)
      if (photosData.length === 0) {
        console.log(`** User has not posted any photos yet **`);
        return response.status(200).json(userObj);
      }

      // handle found photo
      const photos = JSON.parse(JSON.stringify(photosData)); // get data from server and convert to JS data
  
      // get the most recent uploaded photo
      photos.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()); // sort photos in a descending order by date
      if (photos.length > 0) {
        userObj.mostRecentPhotoName = photos[0].file_name;
        userObj.mostRecentPhotoDate = formatDateTime(photos[0].date_time);
      }
  
      // get the most commented photo
      photos.sort((a, b) => b.comments.length - a.comments.length);
      if (photos.length > 0) {
        userObj.mostCommentedPhotoName = photos[0].file_name;
        userObj.commentsCount = photos[0].comments.length;
      }
  
      // response the data back to the frontend browser
      return response.status(200).json(userObj); // retuen user detail INCLUDING recent photo and most commented photo
    } catch (error) {
      console.log(`** From "/user/:id": User ${userID}: Not Found! **`);
      console.log("Error: ", error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  });



 /** 
  * Constructing a photo's like object
  * @param {Object} photos 
  * @param {Object} response 
  * Used by app.get('/photosOfUser/:id')
  * */
function processPhotoLike(photos, response) {

    let processedPhotos = 0; // reset processed photos count for like object

    photos.forEach(photo => {
        async.eachOf(photo.likes, (liked_user_id, index, done_callback) => {
            // For each like in photo's lieks list, use liked_user_id property to find user object in Mongoose database
            User.findOne( {_id: liked_user_id}, (error, user) => {
                if (!error) {
                    const userObj = JSON.parse(JSON.stringify(user)); // parse retrieved Mongoose user data
                    const {location, description, occupation, __v, password_digest, salt, login_name, ...rest} = userObj; // only keep (_id, first_name, last_name) properties
                    photo.likes[index] = rest;      // update the user obj to each comment's user property. 
                }
                done_callback(error);  // this function will execute after all like items in likes list are processed (the third argument)
            });
        }, err => {
            processedPhotos += 1; // the callback functon only get called once after all items have been processed.
            if (err) {
                response.status(400).json({ message: "Error occured in finding likes under a photo" });
                return;
            }
            if (processedPhotos === photos.length) {
                // All photos comments and likes processed!
                response.status(200).json(photos); // Send the response only when all processing is done
            }
        }); // end of "async.eachOf()"
    });
}


/**
 * Sort photo in descending order by likes votes first, then by date
 * Used by app.get('/photosOfUser/:id')
 * @param {Object} photos 
 * @returns list of sorted photos
 */
function sortedPhotos(photos) {
    return photos.sort((a, b) => {
        // Sort by like count in descending order
        if (b.likes.length !== a.likes.length) {
          return b.likes.length - a.likes.length;
        }
        // If like counts are the same, sort by timestamp in descending order
        return new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      });
}

/**
 * * Jian Zhong 
 * * URL /photosOfUser/:id - Return the Photos from User's id
 */
app.get('/photosOfUser/:id', hasSessionRecord, function (request, response) {
    const id = request.params.id;

    /**
     * Finding a single user's photos from the user's ID
     */
    Photo.find( {user_id: id}, (err, photosData) => {
        if (err) {
            console.log(`Photos with user id ${id}: Not Found`);
            response.status(400).json({ message: `Photos with user id ${id}: Not Found` });
        }

        const photos = JSON.parse(JSON.stringify(photosData)); // get data from server and convert to JS data
        if (photos.length === 0) {
            console.log(`Sending photos of Null value to front-end: `, null);
            response.status(200).json(null); // ! but fixed by replacing 'photos' with 'null'
            // ! Bug1 fixed temperally: inifinte loops if refresh the user photos' page 
            // ! when user has no photos posted yet
            // ! but refreshing the page works when user has one or more photos posted.
        }

        /**
         * * Start constructing each photo's comment object
         * * Since each photo has a list of comments with opeartions, so use async.eachOf() 
         * * to do the operations for each comment asynchronously.
         * Since each commment under photo contains only user_id property, 
         * so need to find comment text from user_id, and create each commment object
         */
        // For each photo in photos list:
        sortedPhotos(photos);       // sort photo in descending order by likes votes first, then by date
        let processedPhotos = 0;                                        // count the number of processed photos 
        photos.forEach(photo => {
            delete photo.__v;  // remove the unnessary property before sending to client 
            photo.date_time = formatDateTime(photo.date_time);  // make date time of each photo more readable

            /**
             * * Start constructing each photo's comment object
             * * Since each photo has a list of comments with opeartions, so use async.eachOf() 
             * * to do the operations for each comment asynchronously.
             * Since each commment under photo contains only user_id property, 
             * so need to find comment text from user_id, and create each commment object
             */
            async.eachOf(photo.comments, (comment, index, done_callback) => {
                // For each comment in comments list, use user_id property to find user object in Mongoose database
                User.findOne( {_id: comment.user_id}, (error, user) => {
                    if (!error) {
                        const userObj = JSON.parse(JSON.stringify(user)); // parse retrieved Mongoose user data
                        const {location, description, occupation, __v, ...rest} = userObj; // only keep (_id, first_name, last_name) properties
                        photo.comments[index].user = rest;      // update the user obj to each comment's user property.
                        delete photo.comments[index].user_id;   // remove unnessary property for each comment
                    }
                    done_callback(error);
                });
            }, err1 => {
                processedPhotos += 1; // count increases by 1 when each entire photo's likes list is all done.
                if (err1) { 
                    response.status(400).json({ message: "Error occured in finding commments under a photo" });
                    return;
                }
                if (processedPhotos === photos.length) { // when all photos' likes lists are done, response back to the server.
                    processPhotoLike(photos, response);
                }
            }); // end of "async.eachOf()"
        }); // end of "photoList.forEach()"
    });    
});


/**
 * * Jian Zhong 
 * * URL /updatePhotoLikes/:photo_id - response to like update
 */
app.post('/like/:photo_id', (request, response) => {
    // check empty response
    if (Object.keys(request.body).length === 0) { 
        response.status(400).json({ message: "Server: empty comment is not allowed" });
        return;
    }

    const photoID = request.params.photo_id; // like which photo
    const userID = request.body.action;      // like action by which user 

    Photo.findOne({ _id: photoID })
         .then( async photo => {
            // handle not found
            if (!photo) {
                response.status(400).json({ message: "Server: Photo you just commented is not found" });
            }

            // Using async mutex to protect race conditions and update the like votes
            try {
                const release = await mutex.acquire();

                // Critical section: Only one request can enter this section at a time
                // Update the likes votes, handle found photo
                if (photo.likes.includes(userID)) { // when hitting a liked photo
                    // Remove an item from the original list (no copy)
                    // * Since you are modifying the array in place, Mongoose is more likely to detect 
                    // * this as a change to the photo object, and the change will persist when you call photo.save().
                    let indexToRemove = photo.likes.indexOf(userID);
                    if (indexToRemove !== -1) {
                        photo.likes.splice(indexToRemove, 1);
                    }

                    // photo.likes = photo.likes.filter(id => id !== userID); // remove the user id
                    // ! Why this filter() doesn't work ? (OK)
                    // * MongoDB's update operation didn't handle the array replacement correctly
                    // * MongoDB recommands modifying the original array to work correctly.
                    // * When you directly assign a new array to photo.likes, Mongoose might not detect 
                    // * this as a change to the photo object, 
                    // * and therefore the change might not persist when you call photo.save().
                } else {                           // when hitting a non-liked photo
                    photo.likes.push(userID);
                }
                console.log(`** Server: ${userID} clicked like button! **`);
                photo.save(); // Update the likes
                release(); // Release the lock after the critical section
                response.status(200).json({ message: "Like updated successfully!" }); // send back succeed response
            } catch (error) {
                response.status(500).json({ message: 'Internal server error' });
            }
        })
         .catch(error => {
            response.status(400).json({ message: "Other error occured: " });
            console.error('Server: Error Updating like info', error);
         });
});

/**
 * Function to delete the entire user account by the user id posted
 */
app.post('/deleteUser/:id', async (request, response) => {
    const userIdToRemove = request.params.id;
    console.log("User to remove: " + userIdToRemove);

    try {
        // Delete the [User]
        const result = await User.findByIdAndDelete(userIdToRemove);
        console.log('Deleted the User: ', result);

        // Delete all [Photos] posted by the user
        const userPhotos = await Photo.find({ user_id: userIdToRemove }); // all photos posted by the user
        const deletionPromises = userPhotos.map(async (photo) => {
            const deletedPhoto = await Photo.findByIdAndDelete(photo._id);
            console.log('Deleted Photo:', deletedPhoto);
        });
        
        /**
         * * Noted: In cases where you want multiple asynchronous operations to run concurrently. 
         * * In such cases, you might use Promise.all() or other approaches.
         */
        await Promise.all(deletionPromises); // Await all deletion promises to complete


        // Delete all [Likes] and [Comments] by the user from all related photos
        let updatedPhoto;
        const allPhotos = await Photo.find(); // collect all the rest phots
        const updatePromises = allPhotos.map(async (photo) => {
            // delete all deleted user's likes in each photo
            if (photo.likes.includes(userIdToRemove)) {
                updatedPhoto = await Photo.finByIdAndUpdate(photo._id, {$pull: { likes: userIdToRemove }}, { new: true }); // To return the updated document
            }
            // delete all deleted user's comments in each photo
            // * Fixed bug: comment.user_id is new ObjectId type, 
            // * and it is not the same as String type even they have the same value!!!!!
            const commentsToDelete = photo.comments.filter(comment => comment.user_id.toString() === userIdToRemove); // see if any photo has comment by the deleted user
            const commentUpdatePromises = commentsToDelete.map(async (commentToDelete) => {
                updatedPhoto = await Photo.findByIdAndUpdate(photo._id, {$pull: { comments: commentToDelete }}, { new: true });
            });
            // Combine all comment deletion promises for this photo
            const combinedPromises = updatedPhoto ? [updatedPhoto, ...commentUpdatePromises] : commentUpdatePromises;
            return combinedPromises;
        });

        // Await all deletion promises to complete and return to front-end
        const flattenedPromises = updatePromises.flat(); // Flatten the array of arrays into a single array of promises
        await Promise.all(flattenedPromises);  
        response.status(200).json({ message: "User deleted successfully!" });
    } catch(error) {
        console.error('Error destroying User:', error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
    
});

/**
 * To delete a comment from the comment id and from a photo id.
 */
app.post('/deleteComment/:id', async (request, response) => {
    const commentIdToDelete = request.params.id; // comment id to remove
    const photoID = request.body.photo_id;       // commented photo's ID
    
    try {
        // find comment obj by comment id
        const photo = await Photo.findById(photoID);
        if (!photo) {
            console.log("Photo not found");
            response.status(404).json({ message: 'Photo not found' });
        }
        console.log("Photo found: ", photo);
        const commentToDelete = photo.comments.filter(comment => comment._id.toString() === commentIdToDelete);
        if (commentToDelete.length !== 1) {
            console.log("Comment not found");
            response.status(404).json({ message: 'Comment not found' });
        }

        // remove the comment obj from the photo's comments list
        const updatedPhoto = await Photo.findByIdAndUpdate(photoID, {$pull: { comments: commentToDelete[0] }}, { new: true });
        if (updatedPhoto) {
            console.log("Updated photo: ", updatedPhoto);
            response.status(200).json({ message: "Comment deleted successfully!" });
        } 
    } catch(error) {
        console.error('Error deleting comment:', error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/deletePhoto/:id', async (request, response) => {
    const photoIdToDelete = request.params.id; // photo id to remove
    
    try {
        // find comment obj by comment id
        const deleted_photo = await Photo.findByIdAndDelete(photoIdToDelete);
        if (!deleted_photo) {
            console.log("Photo not found");
            response.status(404).json({ message: 'Photo not found' });
        }
        response.status(200).json({ message: "Photo deleted successfully!" });
    } catch(error) {
        console.error('Error deleting comment:', error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});





var server = app.listen(3000, () => {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
