const config = {
  rabbiturl: "amqp://192.168.40.143:5673" || process.env.RABBITMQURL,
  queue: "test" || process.env.QUEUE,
  db: "message_queue" || process.env.DB,
  dbhost: "localhost" || process.env.DBHOST,
  dbuser: "postgres" || process.env.DBUSER,
  dbpwd: "postgres" || process.env.DBPWD,
  dialect: "postgres" || process.env.DIALECT,
};

module.exports = config;
