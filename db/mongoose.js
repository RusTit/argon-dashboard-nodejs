const env = require('dotenv').config({
  path: `./env-files/${process.env.NODE_ENV || 'development'}.env`,
});

if (env.error) {
  console.error(env.error);
}

module.exports = {
  development: {
    uri: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
  staging: {
    uri: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
  production: {
    uri: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
  test: {
    uri: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  },
};
