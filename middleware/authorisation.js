const jwt = require('jsonwebtoken')
const User= require('../models/user')
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const secretKey = "secretkey"
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    //const user = await User.findByPk(userId); - used in sequeslize only
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error occurred while authenticating user:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};