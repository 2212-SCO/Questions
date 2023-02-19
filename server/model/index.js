const {Client} = require('pg');

const client = new Client({
  user: 'gk',
  host: 'localhost',
  database: 'sdc',
  port: 5432,
})

client.connect((err) => {
  if (err) {
    console.error('Could not connect to PostgreSQL database');
    console.error(err);
    process.exit(1); // exit the process with an error code
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

module.exports = {
  getQuestions() {
    return client.query(`SELECT * FROM questions WHERE reported = false LIMIT 1000` )
    .then((result) => result.rows)
    .catch((e) => console.log(e))
  }
}



// module.exports = client;