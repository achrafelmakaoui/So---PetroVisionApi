const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {
    verifyToken,
    verifyTokenPompist,
    verifyTokenSupervisor,
    verifyTokenSupervisorShoop,
    verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id",  async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id" , async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET SUPERVISEURS
router.get("/search/", async (req, res) => {
  const sname = req.query.name;

  try {
    let Users;
    if (sname) {
      const regex = new RegExp(sname, "i");
      Users = await User.find({nomComplet: regex, isSupervisor: true});
    }
    else {
      Users = await User.find();
    }
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/supervisors", async (req, res) => {
  try {
    // Check if there's a query parameter for stationActuel
    const { stationActuel } = req.query;

    // Query to find users with isSupervisor set to true
    let query = { isSupervisor: true };

    // If stationActuel parameter is provided, add it to the query
    if (stationActuel) {
      query.stationActuel = { $regex: new RegExp(stationActuel, 'i') }; // 'i' flag for case-insensitive search
    }

    // Find users based on the query
    const users = await User.find(query);

    // Return the users as a response
    res.json(users);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

//GET SUPERVISEURS SHOOP
router.get("/search/SupervisorShoop/", async (req, res) => {
  const sname = req.query.name;

  try {
    let Users;
    if (sname) {
      const regex = new RegExp(sname, "i");
      Users = await User.find({nomComplet: regex, isSupervisorShoop: true});
    }
    else {
      Users = await User.find();
    }
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/supervisorshoop", async (req, res) => {
  try {
    // Check if there's a query parameter for stationActuel
    const { stationActuel } = req.query;

    // Query to find users with isSupervisor set to true
    let query = { isSupervisorShoop: true };

    // If stationActuel parameter is provided, add it to the query
    if (stationActuel) {
      query.stationActuel = { $regex: new RegExp(stationActuel, 'i') }; // 'i' flag for case-insensitive search
    }

    // Find users based on the query
    const users = await User.find(query);

    // Return the users as a response
    res.json(users);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

//GET POMPIST
router.get("/search/pompist/", async (req, res) => {
  const sname = req.query.name;
  const stationActuel = req.query.stationActuel; 

  try {
    let Users;
    if (sname && stationActuel) {
      const regex = new RegExp(sname, "i");
      Users = await User.find({nomComplet: regex, stationActuel:stationActuel, isPompist: true});
    }
    else if(sname){
      const regex = new RegExp(sname, "i");
      Users = await User.find({nomComplet: regex, isPompist: true});
    }
    else {
      Users = await User.find();
    }
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/pompists", async (req, res) => {
  try {
    // Check if there's a query parameter for stationActuel
    const { stationActuel } = req.query;

    // Query to find users with isSupervisor set to true
    let query = { isPompist: true };

    // If stationActuel parameter is provided, add it to the query
    if (stationActuel) {
      query.stationActuel = { $regex: new RegExp(stationActuel, 'i') }; // 'i' flag for case-insensitive search
    }

    // Find users based on the query
    const users = await User.find(query);

    // Return the users as a response
    res.json(users);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});
// GET USERS
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 })
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET USER STATS

router.get("/stats", verifyTokenAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
