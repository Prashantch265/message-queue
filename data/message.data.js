const messageModel = require("../model/message.model");

const storeMessage = async (data, cb) => {
  let obj = {
    content: data
  }
  await messageModel.create(obj);
  return cb(true);
};

module.exports = { storeMessage };
