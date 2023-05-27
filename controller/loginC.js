const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

function generateToken(id, ispremiumuser) {
  return jwt.sign({ userId: id, ispremiumuser }, 'secretkey');
}

async function signUp(req, res) {
  const { email, name, password } = req.body;

  console.log("Received data:", email, name, password);

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      console.log("User already exists");
      return res.status(409).send({ message: "User already exists" });
    }

    const user = await  User.create({ email, name, password });
    console.log("New user created:", user);

    // Send response with user creation message and token
    return res.status(201).send({
      message: "User created successfully",
      alert: "User has been created" // Add alert message
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({ message: "Internal server error, check for error" });
  }
}

async function login(req, res) {
  const { email } = req.body;

  console.log("Received login data:", email);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("user does not exist");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id,user.ispremiumuser);

    console.log("Login successful");
    return res.status(200).send({ message: "Login successful", token:token });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({ message: "Internal server error, check for error" });
  }
}

module.exports = { signUp, login };