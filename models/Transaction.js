const mongoose = require("mongoose");
const Client = require("./Client");
const axios = require('axios');

const TransactionSchema = new mongoose.Schema(
  {
    ncarnet: { type: Number, required: true },
    nomComplet: { type: String, required: true },
    station: { type: String, required: true },
    ca: { type: Number, required: true },
    qte: { type: Number, required: true },
    produitAcheter: { type: String, required: true },
    points: { type: Number},
    status: { type: String, default:'Encours'},
    imgCounteurWBon: { type: String},
    imgCounteur: { type: String},
  },
  { timestamps: true }
);

// Function to calculate points based on amount spent (ca)
function calculatePoints(ca) {
  return Math.floor(ca / 100);
}

TransactionSchema.pre('save', function(next) {
  this.points = calculatePoints(this.ca);
  next();
});

TransactionSchema.post('save', async function (doc) {
  try {
    // Call the FastAPI endpoint to verify the transaction
    const fastApiUrl = `http://127.0.0.1:8000/verify-transaction/${doc._id}`;  // Change to your FastAPI deployment URL
    const response = await axios.post(fastApiUrl);

    const client = await Client.findOne({ ncarnet: doc.ncarnet });
    if (client) {
      // Calculate points for the transaction
      const points = calculatePoints(doc.ca);

      // Update client's total points and frequency of visits
      client.totalPoints += points;
      client.freqVisiteParMois++;

      // Recalculate moyenneCAVisite
      const transactions = await this.model('Transaction').find({ ncarnet: doc.ncarnet });
      const totalTurnover = transactions.reduce((total, transaction) => total + transaction.ca, 0);
      client.moyenneCAVisite = totalTurnover / client.freqVisiteParMois;

      // Save the updated client
      await client.save();
    } else {
      console.log('Client not found for transaction:', doc.ncarnet);
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
