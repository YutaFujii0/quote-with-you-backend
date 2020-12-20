import csv from 'csv-parser';
import got from 'got';
import { Readable } from 'stream';


export { parseCsv };

const parseCsv = () => {
  const results = [];
  return new Promise(async (resolve, reject) => {
    const url = 'https://serverless-quote-service.s3-ap-northeast-1.amazonaws.com/seed.csv';
    const response = await got(url);
    const readable = Readable.from([response.body])

    readable.pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', (data) => resolve(results));
  })
  .catch(err => console.log(err));
};
