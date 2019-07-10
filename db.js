const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// name of our database
const dbname = 'crud_mongodb';
// location of where our mongoDB database is located
const url = 'mongodb://mongodb:27017';
// Options for mongoDB
const mongoOptions = { useNewUrlParser: true };

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = '';

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

    // If using env vars from secret from service binding
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split('//');
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(':');
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
  dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;
};

const state = {
  mongodb: null
};

const connect = cb => {
  // if state is not NULL
  // Means we have connection already, call our CB
  if (state.db) cb();
  else {
    // attempt to get database connection
    mongodb.connect(mongoURL, function(err, conn) {
      if (err) {
        callback(err);
        return;
      }

      mongodb = conn;
      dbDetails.databaseName = db.databaseName;
      dbDetails.url = mongoURLLabel;
      dbDetails.coll = db.collection;
      dbDetails.type = 'MongoDB';

      console.log('Connected to MongoDB at: %s', mongoURL);
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
  //return state.db;
  return db;
};

module.exports = { getDB, connect, getPrimaryKey };
