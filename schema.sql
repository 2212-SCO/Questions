\c sdc;

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL,
  asker_name VARCHAR(30) NOT NULL,
  asker_email VARCHAR(256) NOT NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT FALSE
)

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id),
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL,
  answerer_name VARCHAR(30) NOT NULL,
  answerer_email VARCHAR(256) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  reported INT NOT NULL DEFAULT 0
)

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answers(id),
  photo_url VARCHAR(512) NOT NULL
)