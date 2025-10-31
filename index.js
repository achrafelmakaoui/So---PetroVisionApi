const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const clientRoute = require("./routes/client");
const shoopRoute = require("./routes/shoop");
const transactionRoute = require("./routes/transaction");
const accessTokenRoute = require("./routes/AccessToken");
const path = require('path');
const cors = require("cors");

// Middleware
app.use(express.json());
app.use('/uploads2', express.static(path.join(__dirname, 'uploads2'))); // Serve images
app.use('/uploads3', express.static(path.join(__dirname, 'uploads3'))); // Serve images

app.get('/',(req,res)=>{
  res.send("let's the party begin");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

// === SECURE POWER BI ENDPOINT ===
app.get("/api/powerbi/:collection", async (req, res) => {
  try {
    // Secure with a secret key (Power BI will use this)
    const token = req.headers["x-api-key"];
    if (token !== process.env.POWERBI_SECRET) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { collection } = req.params;

    // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes(collection)) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Fetch all documents
    const data = await mongoose.connection.db.collection(collection).find({}).toArray();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/sopclients", clientRoute);
app.use("/api/shoop", shoopRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/accessToken", accessTokenRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
