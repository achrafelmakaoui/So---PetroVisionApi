const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nomComplet: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    cin: { type: String, required: true, unique: true },
    telephone: { type: String, required: true, unique: true },
    stationActuel: { type: String, required: false, unique: false },
    shift: { type: String, required: false},
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSupervisor: {
      type: Boolean,
      default: false,
    },
    isSupervisorShoop: {
      type: Boolean,
      default: false,
    },
    isPompist: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
