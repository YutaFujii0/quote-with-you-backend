import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as Promise from "bluebird";
import { parseCsv } from './seed.js';

AWS.config.setPromisesDependency(Promise);

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const pick = (event, context, callback) => {
  const randomRangeKey = uuidv4();
  let params = {
    TableName: process.env.QUOTE_TABLE,
    ProjectionExpression: "quote, whose",
    KeyConditionExpression: "lang = :lang and id > :randomRangeKey",
    ExpressionAttributeValues: {
      ":lang": event.queryStringParameters.lang || "en",
      ":randomRangeKey": randomRangeKey
    },
    Limit: 1
  };

  console.log("Querying.");
  const onQuery = (err, data) => {
      if (err) {
          console.log('Query failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Query succeeded.");
          return callback(null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': 'https://quote2you.yutafujii.net',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({
                  quote: data.Items
              })
          });
      }
  };

  dynamoDb.query(params, onQuery);
};

const list = (event, context, callback) => {
  let params = {
    TableName: process.env.QUOTE_TABLE,
    ProjectionExpression: "id, lang, quote, whose"
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
              headers: {
                'Access-Control-Allow-Origin': 'https://quote2you.yutafujii.net',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({
                  quote: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);
};

const seed = (event, context, callback) => {

  const onBatchWrite = (err, data) => {
    if (err) {
        console.log('Batch write failed. Error JSON:', JSON.stringify(err, null, 2));
        callback(err);
    } else {
        console.log("Batch write succeeded.");
        return callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': 'https://quote2you.yutafujii.net',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quote: data
            })
        });
    }
  };

  parseCsv().then(async (data) => {
    const itemSize = data.length;
    const batchSize = 25;

    for (let j = 0; j * batchSize < itemSize; j++) {
      let params = {
        RequestItems: {
          [process.env.QUOTE_TABLE]: []
        }
      };

      for (let i = j * batchSize; i < Math.min(itemSize, (j + 1) * batchSize); i++) {
        if (Object.keys(data[i]).length !== 3) {
          continue;
        }

        let subParams = {
          PutRequest: {
            Item: {
              lang: data[i]['lang'],
              id: uuidv4(),
              quote: data[i]['quote'],
              whose: data[i]['whose'],
            }
          }
        };
        params.RequestItems[process.env.QUOTE_TABLE].push(subParams);
      }

      dynamoDb.batchWrite(params, onBatchWrite);
      await sleep(20);
    }
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { pick, list, seed };
