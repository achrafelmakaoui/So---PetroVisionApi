const mongoose = require("mongoose");

const AccessTokenSchema = new mongoose.Schema(
  {
    AccessToken: { type: String, required: true}
  },
  { timestamps: true }
);
module.exports = mongoose.model("AccessToken", AccessTokenSchema);

