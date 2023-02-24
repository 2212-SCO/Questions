const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  // user: "gk",
  // host: "localhost",
  // database: "sdc",
  // port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Could not connect to PostgreSQL database");
    console.error(err);
    process.exit(1); // exit the process with an error code
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

module.exports = {
  getQuestions(product_id, count, page) {
    console.log('sent from deployed db')
    return pool
      .query(
        `SELECT
              json_build_object(
                  'question_id', questions.id,
                  'question_body', questions.body,
                  'question_date', questions.date_written,
                  'asker_name', questions.asker_name,
                  'question_helpfulness', questions.helpful,
                  'reported', questions.reported,
                  'answers', (
                      SELECT jsonb_object_agg(
                          to_jsonb(answers.id)::text,
                          to_jsonb(
                              json_build_object(
                                  'id', answers.id,
                                  'body', answers.body,
                                  'date', answers.date_written,
                                  'answerer_name', answers.answerer_name,
                                  'helpfulness', answers.helpful,
                                  'photos', COALESCE(
                                      (
                                          SELECT json_agg(
                                              json_build_object(
                                                  'id', photos.id,
                                                  'url', photos.photo_url
                                              )
                                          )
                                          FROM photos
                                          WHERE photos.answer_id = answers.id
                                      ),
                                      '[]'::json
                                  )
                              )
                          )
                      )
                      FROM answers
                      WHERE answers.question_id = questions.id
                  )
              )
      FROM questions
      WHERE questions.product_id = ${product_id} AND questions.reported = false
      GROUP BY questions.id
      ORDER BY questions.id
      OFFSET ${(page - 1) * 5}
      LIMIT ${count};

    `
      )
      .then((result) => {
        const x = result.rows.map((r) => r.json_build_object)
        return {product_id: product_id, results: x};
      })
      .catch((e) => console.log(e));
  },
};