/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Token, { as: 'tokens', foreignKey: 'userId' });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(96),
        allowNull: false,
        validate: { notEmpty: true },
      },
      username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  /**
   * Authenticate user with email and password
   * @param {String} email
   * @param {String} password
   * @returns {Promise<User|null>} if user exists and correct password returns user else return null
   * @example
   * const user = await User.authenticate('user1', '123456');
   *
   * if (!user) {
   *  return res.status(401).json({ message: 'Invalid email or password' });
   * }
   */
  User.authenticate = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordCorrect = await user.isPasswordMatch(password);

    if (!isPasswordCorrect) return null;

    return user;
  };

  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @returns {Promise<boolean>}
   */
  User.isEmailTaken = async (email) => {
    const user = await User.findOne({ where: { email }, attributes: ['email'] });
    return !!user;
  };

  /**
   * Check if username is taken
   * @param {string} username - The user's username
   * @returns {Promise<boolean>}
   */
  User.isUsernameTaken = async (username) => {
    const user = await User.findOne({ where: { username }, attributes: ['username'] });
    return !!user;
  };

  /**
   * Check is password match user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  User.prototype.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };

  User.beforeSave(async (user, _options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  });

  return User;
};
