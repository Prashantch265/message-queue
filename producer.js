const amqp = require("amqplib/callback_api");
const config = require("./config");
const crypto = require("crypto");
const { ok } = require("assert");

amqp.connect(config.rabbiturl, (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    var queue = config.queue;

    channel.assertQueue(queue, { durable: true });

    function generateMsg() {
      let id = crypto.randomBytes(20).toString("hex");
      return id;
    }
    
    for (let i = 1; i <= 8000; i++) {
      let message = generateMsg();
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(" [%d] Sent %s", i,message);
    }
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});

// var amqpConn = null;
// function start() {
//   amqp.connect(config.rabbiturl, function(err, conn) {
//     if (err) {
//       console.error("[AMQP]", err.message);
//       return setTimeout(start, 1000);
//     }
//     conn.on("error", function(err) {
//       if (err.message !== "Connection closing") {
//         console.error("[AMQP] conn error", err.message);
//       }
//     });
//     conn.on("close", function() {
//       console.error("[AMQP] reconnecting");
//       return setTimeout(start, 1000);
//     });

//     console.log("[AMQP] connected");
//     amqpConn = conn;

//     whenConnected();
//   });
// }

// function whenConnected() {
//   startPublisher();
// }

// var pubChannel = null;
// var offlinePubQueue = [];
// function startPublisher() {
//   amqpConn.createConfirmChannel(function(err, ch) {
//     if (closeOnErr(err)) return;
//     ch.on("error", function(err) {
//       console.error("[AMQP] channel error", err.message);
//     });
//     ch.on("close", function() {
//       console.log("[AMQP] channel closed");
//     });

//     pubChannel = ch;
//     while (true) {
//       var m = offlinePubQueue.shift();
//       if (!m) break;
//       publish(m[0], m[1], m[2]);
//     }
//   });
// }

// // method to publish a message, will queue messages internally if the connection is down and resend later
// function publish(exchange, routingKey, content) {
//   try {
//     pubChannel.publish(exchange, routingKey, content, { persistent: true },
//                        function(err, ok) {
//                          if (err) {
//                            console.error("[AMQP] publish", err);
//                            offlinePubQueue.push([exchange, routingKey, content]);
//                            pubChannel.connection.close();
//                          }
//                        });
//   } catch (e) {
//     console.error("[AMQP] publish", e.message);
//     offlinePubQueue.push([exchange, routingKey, content]);
//   }
// }