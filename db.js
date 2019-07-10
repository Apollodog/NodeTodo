const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// name of our database
const dbname = 'crud_mongodb';
// location of where our mongoDB database is located

const mongoPassword = process.env['MONGODB_PASSWORD'];
const mongoUser = process.env['MONGODB_USER'];

const url =
  'mongodb://' +
  mongoUser +
  ':' +
  mongoPassword +
  '@localhost:27017/crud_mongodb';
// Options for mongoDB
const mongoOptions = { useNewUrlParser: true };

const state = {
  db: null
};

const connect = cb => {
  // if state is not NULL
  // Means we have connection already, call our CB
  if (state.db) cb();
  else {
    // attempt to get database connection
    MongoClient.connect(url, mongoOptions, (err, client) => {
      // unable to get database connection pass error to CB
      if (err) cb(err);
      // Successfully got our database connection
      // Set database connection and call CB
      else {
        state.db = client.db(dbname);
        cb();
      }
    });
  }
};

// returns OBJECTID object used to
const getPrimaryKey = _id => {
  return ObjectID(_id);
};

// returns database connection
const getDB = () => {
  console.log('Paul - DB state is being returned, ' + state.db);
  return state.db;
};

module.exports = { getDB, connect, getPrimaryKey };
