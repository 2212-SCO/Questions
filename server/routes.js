const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/questions', controller.getQuestions);

module.exports = router;