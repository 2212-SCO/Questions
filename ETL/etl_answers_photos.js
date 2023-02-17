const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;
const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'ID' },
    { id: 'answer_id', title: 'Answer ID' },
    { id: 'url', title: 'URL' }
  ],
});

let readStream = fs.createReadStream('data/raw-data/answers_photos.csv');
let writeStream = fs.createWriteStream('data/clean-data/answers_photos.csv');

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
    chunk.url = chunk.url.trim();
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