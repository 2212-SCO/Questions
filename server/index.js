require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const router = require('./routes.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
