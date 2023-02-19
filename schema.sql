\c sdc;

DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL,
  asker_name VARCHAR(30) NOT NULL,
  asker_email VARCHAR(256) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id),
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL,
  answerer_name VARCHAR(30) NOT NULL,
  answerer_email VARCHAR(256) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answers(id),
  photo_url VARCHAR(512) NOT NULL
);

CREATE INDEX IF NOT EXISTS questions_id_idx ON questions (id);
CREATE INDEX IF NOT EXISTS answers_id_idx ON answers (id);
CREATE INDEX IF NOT EXISTS questions_reported_idx ON questions (reported) WHERE reported = false;

\COPY questions FROM 'data/clean-data/questions.csv' WITH (FORMAT csv, HEADER true);
\COPY answers FROM 'data/clean-data/answers.csv' WITH (FORMAT csv, HEADER true);
\COPY photos FROM 'data/clean-data/answers_photos.csv' WITH (FORMAT csv, HEADER true);
