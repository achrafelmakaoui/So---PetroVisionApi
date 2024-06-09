const AccessToken = require("../models/AccessToken");

const {
    verifyToken,
    verifyTokenPompist,
    verifyTokenSupervisor,
    verifyTokenSupervisorShoop,
    verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", async (req, res) => {
    try {
      // Delete all existing records
      await AccessToken.deleteMany({});
  
      // Create and save the new record
      const newAccessToken = new AccessToken(req.body);
      const savedAccessToken = await newAccessToken.save();
  
      // Respond with the saved record
      res.status(200).json(savedAccessToken);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//GET AccessToken
router.get("/", async (req, res) => {
    try {
      const latestAccessToken = await AccessToken.find().sort({ createdAt: -1 }).limit(1);
      res.status(200).json(latestAccessToken);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
