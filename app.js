const express = require("express");
const amqp = require("amqplib/callback_api");

const app = express();

require("dotenv").config();
require("./consumer")(amqp);

app.get("/getfibonacci", (req, res) => {
  const startTime = new Date();
  const result = fibonacci(parseInt(req.query.number)); //parseInt is for converting string to number
  const endTime = new Date();
  res.json({
    number: parseInt(req.query.number),
    fibonacci: result,
    time: endTime.getTime() - startTime.getTime() + "ms",
  });
});
const fibonacci = (n) => {
  if (n <= 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
};


module.exports = app;
