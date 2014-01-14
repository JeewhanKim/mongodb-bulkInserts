// Node.js Test File
// Bulk Inserts on Sharded Clusters [1 million data]
// Jeewhan Kim 2012.

var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

var config = require('config');
var async = require('async');
var util = require('util');

var collectionName = "shardtest";
var servers = new mongodb.Server('127.0.0.1', 40000, { auto_reconnect: true });
var db = new mongodb.Db("sharding", servers);

//setInterval(beginTest, 1*1000);
beginTest();

function beginTest()
{
 db.open(function(err, db){
  if(!err){

    console.log("Connected to 'sharding' database");

    var result = db.collection('shardtest', {safe:false}, function(err, collection){
    
    if (err){
      console.log("error");
      db.close();
    }

    var testItem = {};

    for(var i=0; i<1000000; i++){
      testItem._id = new ObjectID();
      testItem.key = i;
      testItem.name = "test_1000000_data_#" + i;
      testItem.data = "Aliquam nec semper augue, in luctus risus. Mauris eu adipiscing turpis. Suspendisse sed libero enim. Aliquam porta feugiat massa. Donec libero sem, tincidunt vitae sem eu, euismod aliquet nisi. Suspendisse porttitor, neque pulvinar convallis tincidunt, ipsum nulla consectetur orci, non pharetra nulla neque id lacus. Suspendisse potenti. Vivamus feugiat, arcu vitae scelerisque posuere, diam ligula faucibus lectus, quis tempus libero sapien sit amet augue. Praesent ornare dui a augue consequat, quis ullamcorper leo ullamcorper. Etiam vitae massa sed leo molestie aliquam sit amet eu tellus. Vivamus aliquam posuere gravida."    
      AddItem(db, collection, testItem, i);
    }

    });
   
    var result = true;
      
    if (result) console.log("Done");
    else console.log("Error");

  }  
  }, db.close()
  );
}

function GetItem(db, collection) {
  console.log("---FIND ITEM---");
  
  var results = collection.find().toArray(function (err, results) {
  
    for (var i=0; i<results.length; i++){
      console.log("ResultsNo : " + i + " | _id : " + results[i]._id + " | key : " + results[i].key + " | name : " + results[i].name);
    }
  }); 
  return;
}

function AddItem(db, collection, testItem, i) {
  console.log("---ADD ITEM---");

  collection.insert(testItem, {safe:false}, function(err, result) {
    if(err){
      console.log("Error #" + i);
    } else {
      console.log("Success #" + i);
    }
  });
}

exports.add = function(response) {

  var testItem = response.body;

  console.log("Add ITEM---");

  db.collection('shardtest', function(err, collection) {
    collection.insert(testItem, {safe:true}, function(err, result) {
      if (err){
        res.send({'error':'An error has occurred'});
      } else {
        console.log("Success");
      res.send(result[0]);
      }
    });
  });
};
