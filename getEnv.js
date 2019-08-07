const { Storage } = require('@google-cloud/storage');

const { GOOGLE_CLOUD_PROJECT } = process.env;
const logger = require('./logger');

if (!GOOGLE_CLOUD_PROJECT) {
  logger.info('Running locally. Exit.');
  process.exit(0);
} else {
  logger.info('Running in Google Platform');
}

const storage = new Storage();

const bucketName = `${GOOGLE_CLOUD_PROJECT}.appspot.com`;
storage
  .bucket(bucketName)
  .file('.env')
  .download({ destination: '.env' })
  .then(() => {
    logger.info('getEnv.js: .env downloaded successfully');
  })
  .catch(e => {
    if (e.code === 404) {
      logger.warn('.env file is missing in the bucket, ignoring.');
    } else {
      logger.error(`getEnv.js: There was an error: ${JSON.stringify(e, undefined, 2)}`);
    }
  });
