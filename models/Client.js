const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    nomComplet: { type: String, required: true},
    telephone: { type: String, required: true, unique: true },
    ncarnet: { type: Number, required: true, unique: true },
    stationInscription: { type: String, required: true},
    permisConfiance: {type: Number, required: true, unique: true},
    matricule: {type: String, required: true, unique: true},
    numeroTaxi: {type: Number, required: true, unique: true},
    marqueVehicule: {type: String, required: true},
    typeTaxi:{type: String, required: true},
    proprietaire: { type: Boolean},
    freqVisiteParMois: {type: Number, required: true},
    moyenneCAVisite: {type: Number, required: true},
    totalPoints:{type: Number, required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Client", ClientSchema);
// module.exports = mongoose.model("Product", ProductSchema);
