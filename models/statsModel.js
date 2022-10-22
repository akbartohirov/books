const mongoose = require("mongoose");

const statsModel = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
  },
  cash: {
    type: Boolean,
    default: true,
  },
  returned: {
    type: Boolean,
    default: false,
  },
});

const Stats = mongoose.model("Stats", statsModel);

module.exports = Stats;
