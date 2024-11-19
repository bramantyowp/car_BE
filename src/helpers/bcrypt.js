const bcrypt = require('bcryptjs')
const salt = 10;
 
/**
 * Encrypt a given password using bcrypt
 * @param {string} password - Password to be encrypted
 * @returns {Promise<string>} - Encrypted password
 * for register
 */
async function encryptPassword(password){
    const result = await bcrypt.hash(password, bcrypt.genSaltSync(salt))
    return result;
}

/**
 * Check if a given password matches a given encrypted password
 * @param {string} password - Password to be checked
 * @param {string} encryptedPassword - Encrypted password to be checked against
 * @returns {Promise<boolean>} - True if the password matches, false otherwise
 * for login
 */
 async function checkPassword(password, encryptedPassword){
    const result = await bcrypt.compare(password, encryptedPassword)
    return result
}

module.exports = {
    encryptPassword,
    checkPassword
}