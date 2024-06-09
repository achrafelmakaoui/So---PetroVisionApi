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
