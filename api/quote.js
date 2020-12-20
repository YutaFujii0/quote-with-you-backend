'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  var params = {
    TableName: process.env.QUOTE_TABLE,
    ProjectionExpression: "id, quote, author"
  };

  console.log("Scanning Quote table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  quote: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};
