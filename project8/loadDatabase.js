/* jshint node: true */

/*
 * The loadDatabase.js script exists and works to load a clean instance of MongoDB with 
 * the appropriate schemas and objects for the photo app to run.
 * 
 * This Node.js program loads the model data into Mongoose defined objects
 * in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'cs142project6'.  In loads
 * into collections named User and Photos. The Comments are added in the Photos of the
 * comments. Any previous objects in those collections is discarded.
 * 
 * The loadDatabase.js script exists and works to load a clean instance of MongoDB with 
 * the appropriate schemas and objects for the photo app to run.
 *
 * NOTE: This scripts uses Promise abstraction for handling the async calls to
 * the database. We are not teaching Promises in CS142 so strongly suggest you don't
 * use them in your solution.
 */

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// Get the magic models we used in the previous projects.
var cs142models = require('./modelData/photoApp.js').cs142models;

// Load the Mongoose schema for Use and Photo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var versionNumber = 1.01;

// We start by removing anything that existing in the collections.
var removePromises = [User.deleteMany({}), Photo.deleteMany({}), SchemaInfo.deleteMany({})];


// Load the users into the "User". Mongo assigns ids to objects so we record
// the assigned '_id' back into the cs142model.userListModels so we have it
// later in the script.
Promise.all(removePromises).then(function () {
    var userModels = cs142models.userListModel();
    var mapFakeId2RealId = {}; // Map from fake id to real Mongo _id
    var userPromises = userModels.map(function (user) {
        return User.create({
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation,
            login_name: user.last_name.toLowerCase(), // to login with this value and password
            password_digest: '3c53e115625c62868a32faaee3e0021b27850541',
            salt: "12345678",
        }).then(function (userObj) { // * object created by User.create(), gernerating an unique MongoDB assigned ID: "_id"
            // Set the unique ID of the object. We use the MongoDB generated _id for now
            // but we keep it distinct from the MongoDB ID so we can go to something
            // prettier in the future since these show up in URLs, etc.
            userObj.save();
            mapFakeId2RealId[user._id] = userObj._id; // ! mapFakeId2RealId [fake]: real, we will only use the fake ID.
            user.objectID = userObj._id;    // keep the MongoDB assigned id in "user.objectID" (Object Type), and use the pretty id as "user._id" instead.
            console.log('Adding user:');
            console.log(user);
            console.log('Adding userObj:');
            console.log(userObj);

        }).catch(function (err){
            console.error('Error create user', err);
        });
    });


    var allPromises = Promise.all(userPromises).then(function () {
        // Once we've loaded all the users into the User collection we add all the photos. Note
        // that the user_id of the photo is the MongoDB assigned id in the User object.
        var photoModels = [];
        var userIDs = Object.keys(mapFakeId2RealId); // Extracting all the fake IDs as a list: ["fakeId1", "fakeId2", "fakeId3"]
        for (var i = 0; i < userIDs.length; i++) {
            photoModels = photoModels.concat(cs142models.photoOfUserModel(userIDs[i]));
        }
        var photoPromises = photoModels.map(function (photo) {
            // map each fake user id to real user id into "likeObj" (Author: Jian Zhong)
            const likesObj = photo.likes.map(fakeID => mapFakeId2RealId[fakeID]); 
            return Photo.create({
                file_name: photo.file_name,
                date_time: photo.date_time,
                user_id: mapFakeId2RealId[photo.user_id], // the MongoDB assigned id in the User object
                likes: likesObj, // likes now contain the MongoDB assigned id in the User Object (Author: Jian Zhong)
            }).then(function (photoObj) {
                photo.objectID = photoObj._id;           // the MongoDB assigned id in the Photo object
                if (photo.comments) {
                    photo.comments.forEach(function (comment) {
                        photoObj.comments = photoObj.comments.concat([{
                            comment: comment.comment,
                            date_time: comment.date_time,
                            user_id: comment.user.objectID // the MongoDB assigned id in the User object
                        }]);
                        // console.log("Adding comment of length %d by user %s to photo %s",
                        //     comment.comment.length,
                        //     comment.user.objectID,
                        //     photo.file_name);
                    });
                }
                // console.log("Adding photo:");
                // console.log(photoObj);
                photoObj.save();
            }).catch(function (err){
                console.error('Error create user', err);
            });
        });
        return Promise.all(photoPromises).then(function () {
            // Create the SchemaInfo object
            return SchemaInfo.create({
                version: versionNumber,
            }).then(function (schemaInfo) {
                console.log('SchemaInfo Object: ', schemaInfo, ' created with version ', versionNumber);
            }).catch(function (err){
                console.error('Error create schemaInfo', err);
            });
        });
    });

    allPromises.then(function () {
        mongoose.disconnect();
    });

}).catch(function(err){
    console.error('Error create schemaInfo', err);
});
