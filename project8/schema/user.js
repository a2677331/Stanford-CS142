"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var userSchema = new mongoose.Schema({
    first_name: String,  // First name of the user.
    last_name: String,   // Last name of the user.
    location: String,    // Location  of the user.
    description: String, // A brief user description
    occupation: String,  // Occupation of the user.
    login_name: String,  // Identifier the user will type when logging in
    password_digest: String,   // SHA-1 hashed password for the user
    salt: String,        // random calculated characters as salt for password
    total_likes: Number, // total number of likes a user has 
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
