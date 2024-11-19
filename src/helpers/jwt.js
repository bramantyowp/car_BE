const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

/**
 * Creates a JSON Web Token (JWT) based on the provided payload.
 *
 * @param {object} payload - The data to be encoded in the JWT.
 * @return {string} The generated JWT.
 */

function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1800s" });
}

/**
 * Verifies a given JSON Web Token (JWT) using the secret key.
 *
 * @param {string} token - The JWT to be verified.
 * @return {object|string} The decoded payload or the error message if verification fails.
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  createToken,
  verifyToken
};
