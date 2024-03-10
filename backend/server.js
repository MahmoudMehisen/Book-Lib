const express = require("express");
const helmet = require('helmet');
const bodyParser = require("body-parser");
const db = require("./src/config/postgres.config");
const apiRoute = require('./src/routes/api.route');
require('dotenv').config();

const app = express();

app.use(helmet());

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.use(bodyParser.json());

app.use('/api', apiRoute);


app.use((req, res) => {
  res.status(404).send({ message: "Router Not Found." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});