const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); // http://expressjs.com/en/resources/middleware/body-parser.html
app.use('/', router);

app.listen(port, () => {
  console.log(`L'API peut maintenant recevoir des requêtes: http://localhost:${port}`);
});
