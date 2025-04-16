const crypto = require('crypto')

const validatePassword = (password, salt) => {
  const hashedAttempt = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return hashedAttempt
}

module.exports = { validatePassword }