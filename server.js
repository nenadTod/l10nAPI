var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LANGUAGES_COLLECTION = "languages";

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(allowCrossDomain);
var db_conn = "mongodb://localhost:27017/l10nDB";

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;


// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || db_conn, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// LANGUAGES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/languages", function(req, res) {
  db.collection(LANGUAGES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get languages.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/languages/:lng", function(req, res) {
  console.log(req.params);
  db.collection(LANGUAGES_COLLECTION).findOne({ lng: req.params.lng }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get language");
    } else {
      res.status(200).json(doc);
    }
  });
});

/* Used to init collection
app.post("/languages", function(req, res) {

  var srpski = {
    '_id': 1,
    'lng': "srpski",
    'ttl': 'Naslov'    
  };

  var english = {
    '_id': 2,
    'lng': "english",
    'ttl': "Title"
  }

  db.collection(LANGUAGES_COLLECTION).insertOne(srpski, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create entity 'srpski'.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });

  db.collection(LANGUAGES_COLLECTION).insertOne(english, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create entity 'english'.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });

});
*/

/*
Uncomment if you need any :P

app.put("/languages/:id", function(req, res) {
});

app.delete("/languages/:id", function(req, res) {
});
*/