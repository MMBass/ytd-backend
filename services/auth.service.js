const dev_config = (process.env.store === undefined) ? require('../devConfig') : undefined;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function validateKey(reqUser, cb) {
  try {
    // prevent injection here if using DB
    bcrypt.compare(reqUser.key/*clinet pass*/, process.env.googleTokenHash ||  dev_config.googleTokenHash/*hash*/, function (err, result) {
      if (err) {
        cb(err);
      } else if (result === true) {
        const at_secret = process.env.atSecret || dev_config.atSecret;
        const accessToken = jwt.sign({ user: "creator" }, at_secret, { expiresIn: 60 * 60 });
        cb(null, accessToken)
      } else {
        cb(null, false)
      }
    });

  } catch (err) {
    cb(err);
  }
}

function validateAccess(at, cb) {
    const at_secret = process.env.atSecret || dev_config.atSecret;
    jwt.verify(at, at_secret, function (err, decoded) {
      if (err) {
        cb(err);
        return;
      }
      if(decoded.user){
        cb(null, true);
      }
    });
}

module.exports = { validateKey, validateAccess };