const { GCLOUD_PROJECT } = process.env;

if (!GCLOUD_PROJECT) {
  console.info('Running locally. Exit.');
  process.exit(0);
} else {
  console.info('Running in Google Platform');
}

const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const bucketName = `${GCLOUD_PROJECT}.appspot.com`;
storage
  .bucket(bucketName)
  .file('.env')
  .download({ destination: '.env' })
  .then(() => {
    console.info('getEnv.js: .env downloaded successfully');
  })
  .catch(e => {
    console.error(`getEnv.js: There was an error: ${JSON.stringify(e, undefined, 2)}`);
  });
