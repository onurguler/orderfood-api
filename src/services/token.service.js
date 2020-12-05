const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../database');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {BigInt} userId
 * @param {string} key
 * @param {string} type
 * @param {Moment} expires
 * @param {boolean} [blacklisted]
 * @param {Object} [options]
 * @returns {Promise<Token>}
 */
const saveToken = async (userId, key, type, expires, blacklisted = false, options = {}) => {
  const token = await Token.create(
    {
      userId,
      key,
      type,
      expires: expires.toDate(),
      blacklisted,
    },
    options
  );
  return token;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
exports.generateAuthTokens = async (user, options = {}) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(user.id, refreshToken, tokenTypes.REFRESH, refreshTokenExpires, false, options);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token|null>}
 */
exports.verifyToken = async (key, type) => {
  const payload = jwt.verify(key, config.jwt.secret);
  if (payload.type !== type) {
    return null;
  }
  const token = await Token.findOne({ where: { userId: payload.sub, key, type, blacklisted: false } });
  if (!token) {
    return null;
  }
  return token;
};
