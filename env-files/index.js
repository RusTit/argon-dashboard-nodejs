const path = require('path');

const fileName = `./${process.env.NODE_ENV || 'development'}.env`;
const fullPath = path.resolve(__dirname, fileName);
let env = require('dotenv').config({
  path: fullPath,
});
const logger = require('../logger');

if (env.error) {
  logger.error('Error loading enviroment files: %s', env.error);
}

const deployedFileName = '.env';
const fullDeployedPath = path.resolve(__dirname, '..', deployedFileName);

env = require('dotenv').config({
  path: fullDeployedPath,
});

if (env.error) {
  if (env.error.code === 'ENOENT') {
    logger.warn('Deployed .env file is missing, skipping.');
  } else {
    logger.error('Error loading enviroment files: %s', env.error);
  }
}
