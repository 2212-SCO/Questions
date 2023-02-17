const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;
const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'ID' },
    { id: 'product_id', title: 'Product ID' },
    { id: 'body', title: 'Body' },
    { id: 'date_written', title: 'Date Written' },
    { id: 'asker_name', title: 'Asker Name' },
    { id: 'asker_email', title: 'Asker Email' },
    { id: 'reported', title: 'Reported' },
    { id: 'helpful', title: 'Helpful' },
  ],
});

let readStream = fs.createReadStream('data/raw-data/questions.csv');
let writeStream = fs.createWriteStream('data/clean-data/questions.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    // for (let key in chunk) {
    //   //trims whitespace
    //   let trimKey = key.trim();
    //   chunk[trimKey] = chunk[key];
    //   if (key !== trimKey) { delete chunk[key]; }
    // }

    // removes white space
    chunk.body = chunk.body.trim();
    //filters out all non-number characters
    chunk.id = chunk.id.replace(/\D/g, '');
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