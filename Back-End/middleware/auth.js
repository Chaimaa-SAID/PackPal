const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json("Authorization header is missing");
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json("Token is missing");
  }
  
  jwt.verify(token, "secretcode" , (error, user) => {
    if (error) {
      return res.status(401).json("Invalid token or unauthorized");
    }
    req.user = user;
    next();
  });
};

module.exports = auth;