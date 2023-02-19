const axios = require('axios');
const model = require('../model')

module.exports = {
  getQuestions(req, res) {
    model.getQuestions()
      .then((response) => {console.log('yo', response); res.status(201).json(response).send()})
      .catch(err =>  res.status(500).send(err))
  }
}