/**
 * * Jian Zhong: Project 7 Extra Credits
 * * Deal with  password salt and hashing
 */

const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');

/**
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
    const saltText = randomBytes(8).toString('hex');
    const sha1 = createHash('sha1');
    sha1.update(saltText + clearTextPassword);
    return {
        salt: saltText,
        hash: sha1.digest('hex'),
    };
}


/**
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
    const sha1 = createHash('sha1'); // use sha1 hash to verify password
    return hash === sha1.update(salt + clearTextPassword).digest('hex');
}

// make my functions available to webServer.js
module.exports = {
    makePasswordEntry: makePasswordEntry,
    doesPasswordMatch: doesPasswordMatch,
};

