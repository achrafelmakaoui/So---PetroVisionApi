const mongoose = require("mongoose");
const Client = require("./Client");

const ShoopSchema = new mongoose.Schema(
  {
    ncarnet: { type: Number, required: true },
    nomComplet: { type: String, required: true },
    station: { type: String, required: true },
    typeShoop: { type: String, required: true },
    shoop: { type: String, required: true },
    pointShoop: { type: Number, required: true },
    imgRecip: { type: String},
  },
  { timestamps: true }
);

ShoopSchema.post('save', async function(doc) {
  try {
    const client = await Client.findOne({ ncarnet: doc.ncarnet });
    if (client) {
      client.totalPoints -= doc.pointShoop;
      await client.save();
    } else {
      console.log('Client not found for transaction:', doc.ncarnet);
    }
  } catch (error) {
    console.error('Error updating client:', error);
  }
});

module.exports = mongoose.model("Shoop", ShoopSchema);