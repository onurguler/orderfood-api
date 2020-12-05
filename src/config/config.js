const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    DEV_DB_USERNAME: Joi.string().required().description('Postgres username'),
    DEV_DB_PASSWORD: Joi.string().allow('').description('Postgres password'),
    DEV_DB_NAME: Joi.string().required().description('Database name'),
    CI_DB_USERNAME: Joi.string().required().description('Postgres username'),
    CI_DB_PASSWORD: Joi.string().allow('').description('Postgres password'),
    CI_DB_NAME: Joi.string().required().description('Database name'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
    },
  },
  database: {
    development: {
      username: envVars.DEV_DB_USERNAME,
      password: envVars.DEV_DB_PASSWORD,
      database: envVars.DEV_DB_NAME,
    },
    test: {
      username: envVars.CI_DB_USERNAME,
      password: envVars.CI_DB_PASSWORD,
      database: envVars.CI_DB_NAME,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
};
