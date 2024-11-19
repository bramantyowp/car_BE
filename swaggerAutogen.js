const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.3",
});

const doc = {
  info: {
    title: "Car Rental",
    description: "Car RentalAPI",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-autogen.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
