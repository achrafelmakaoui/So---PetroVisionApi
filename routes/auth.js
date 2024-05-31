const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const qs = require('qs');
const axios = require('axios');

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    nomComplet: req.body.nomComplet,
    email: req.body.email,
    cin: req.body.cin,
    telephone: req.body.telephone,
    stationActuel: req.body.stationActuel,
    shift: req.body.shift,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    isAdmin: req.body.isAdmin,
    isSupervisor: req.body.isSupervisor,
    isSupervisorShoop: req.body.isSupervisorShoop,
    isPompist: req.body.isPompist,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ cin: req.body.cin });
    !user && res.status(401).json("Wrong credentials!");
    
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isSupervisor: user.isSupervisor,
        isSupervisorShoop: user.isSupervisorShoop,
        isPompist: user.isPompist
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );

    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});
// https://login.microsoftonline.com/dc59e38c-4977-406f-bdd1-9ebbabbd387e/adminconsent?client_id=6cd5d3dc-aec6-41d3-b0f0-f8eb97165145


const clientId = '6cd5d3dc-aec6-41d3-b0f0-f8eb97165145';
const clientSecret = 'A2o8Q~CL41eG9BcGKyx.KFkxA4m.CEud2mH78dpp';
const tenantId = 'dc59e38c-4977-406f-bdd1-9ebbabbd387e';
const resource = 'https://analysis.windows.net/powerbi/api';

router.get('/refresh-token', async (req, res) => {
  const data = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      resource: resource,
  };

  try {
      const response = await axios.post(
          `https://login.microsoftonline.com/${tenantId}/oauth2/token`,
          qs.stringify(data),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      res.json(response.data);
  } catch (error) {
      if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          res.status(error.response.status).json({ error: error.response.data });
      } else if (error.request) {
          console.error('Error request data:', error.request);
          res.status(500).json({ error: 'No response received from the server' });
      } else {
          console.error('Error message:', error.message);
          res.status(500).json({ error: error.message });
      }
  }
});

module.exports = router;
