const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};
const verifyTokenPompist = (req, res, next) => {
  verifyToken(req, res, () => {''
    if (req.user.isPompist) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
const verifyTokenSupervisor = (req, res, next) => {
  verifyToken(req, res, () => {''
    if (req.user.isSupervisor) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
const verifyTokenSupervisorShoop = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isSupervisorShoop) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenPompist,
  verifyTokenSupervisor,
  verifyTokenSupervisorShoop,
  verifyTokenAdmin,
};
