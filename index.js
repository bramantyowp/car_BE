const envPath = process.env.NODE_ENV !== 'test' ? 
  '.env' : `.env.${process.env.NODE_ENV}` // .env || .env.test
require('dotenv').config({path: envPath})
const http = require('http');
const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const routes = require('./src/routes')
const errorHandler = require("./src/middlewares/errorHandler");
const server = http.createServer(app)
const { PORT = 3000 } = process.env;

// const server = http.createServer(app);

// untuk meregistrasi global variable untuk error handling
require("./src/helpers/errors");

app.use(cors())
app.use(express.json());

app.use("/public", express.static(path.resolve(__dirname, "public")));

app.get('/', async (req, res) => {
  res.status(200).send('Car Rental API')
})

app.use('/api/v1', routes)

//application level middleware untuk error handling
app.use(errorHandler)

app.use((req, res, next) => {
  next(new NotFoundError(null, "Sorry, page not found!"));
})

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = server;
