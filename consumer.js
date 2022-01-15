const config = require("./config");
const { storeMessage } = require("./data/message.data");

module.exports = (amqp) => {
  amqp.connect(config.rabbiturl, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = config.queue;

      channel.assertQueue(queue, {
        durable: true,
      });

      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );

      // channel.checkQueue(queue, (err, ok) => {
      //   // setMessageCount(ok.messageCount);
      //   console.log(ok.messageCount);
      // });

      // function setMessageCount(count){
      //   messageCount = count;
      //   while(messageCount != 0){
      //     channel.get(queue, { noAck: true }, (err, msg) => {
      //       let string = msg.content.toString("utf8");
      //       console.log(" [x] Received %s", string);
      //       storeMessage(string);
      //     });
      //   }
      // }

      // channel.get(queue, { noAck: true }, (err, msg) => {
      // let string = msg.content.toString("utf8");
      //   console.log(" [x] Received %s", string);
      //   storeMessage(string);
      // });

      channel.prefetch(10);

      channel.consume(queue, processMessage, { noAck: false });

      function processMessage(msg) {
        let string = msg.content.toString("utf8");
        storeMessage(string, (ok) => {
          try {
            if (ok) channel.ack(msg);
            else channel.reject(msg);
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  });
};
