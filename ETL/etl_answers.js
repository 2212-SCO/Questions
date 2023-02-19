const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;
const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'ID' },
    { id: 'question_id', title: 'Question ID' },
    { id: 'body', title: 'Body' },
    { id: 'date_written', title: 'Date Written' },
    { id: 'answerer_name', title: 'Answerer Name' },
    { id: 'answerer_email', title: 'Answerer Email' },
    { id: 'reported', title: 'Reported' },
    { id: 'helpful', title: 'Helpful' },
  ],
});

let readStream = fs.createReadStream('data/raw-data/answers.csv');
let writeStream = fs.createWriteStream('data/clean-data/answers.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      //trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) { delete chunk[key]; }
    }
    // removes white space
    chunk.body = chunk.body.trim();
    //filters out all non-number characters
    chunk.id = chunk.id.replace(/\D/g, '');
    // changes date from unix timestamp to iso string
    chunk.date_written = new Date(parseInt(chunk.date_written)).toISOString();
    //uses our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

const transformer = new CSVCleaner({ writableObjectMode: true });

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished'); });