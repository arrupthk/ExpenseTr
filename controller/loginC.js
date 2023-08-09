// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// function generateToken(id) {
//   return jwt.sign({ userId: id }, 'secretkey');
// }

// async function signUp(req, res) {
//   const { email, name, password } = req.body;
//   console.log(req.body, "printing requested body here")

//   try {
//     const existingUser = await User.findOne({ email });
//     console.log("existingUser: printing here", existingUser)

//     if (existingUser) {
//       return res.status(409).send({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({ email, name, password: hashedPassword });
//     console.log("printing hashed password after creating", hashedPassword )
//     const token = generateToken(user._id);
//     return res.status(201).send({
//       message: "User created successfully",
//       token: token,
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).send({ message: "Internal server error, check for error" });
//   }
// }


// async function login(req, res) {
//   const { email, password } = req.body;
//   console.log("login details", req.body)
//   console.log("line no.37")

//   try {
//     const user = await User.findOne({ email });
//     console.log(email, "printing email id here")
//     if (!user) {
//       return res.status(401).send({ message: "Invalid email or password" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("Entered password:", password);
//     console.log("Stored hashed password:", user.password);
//     console.log("hashed password", hashedPassword)
//     console.log("Is password valid:", isPasswordValid);
//     if (!isPasswordValid) {
//       return res.status(401).send({ message: "Invalid password" });
//     }
//     const token = generateToken(user._id);
//     return res.status(200).send({ message: "Login successful", token: token });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).send({ message: "Internal server error, check for error" });
//   }
// }
// module.exports = { signUp, login };

// was checking it
// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// function generateToken(id) {
//   return jwt.sign({ userId: id }, 'secretkey');
// }

// async function signUp(req, res) {
//   const { email, name, password } = req.body;
//   console.log(req.body, "printing requested body here")

//   try {
//     const existingUser = await User.findOne({ email });
//     console.log("existingUser: printing here", existingUser)

//     if (existingUser) {
//       return res.status(409).send({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({ email, name, password: hashedPassword });
//     console.log("printing hashed password after creating", hashedPassword )
//     const token = generateToken(user._id);
//     return res.status(201).send({
//       message: "User created successfully",
//       token: token,
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).send({ message: "Internal server error, check for error" });
//   }
// }


// async function login(req, res) {
//   const { email, password } = req.body;
//   console.log("login details", req.body)
//   console.log("line no.37")

//   try {
//     const user = await User.findOne({ email });
//     console.log(email, "printing email id here")
//     if (!user) {
//       return res.status(401).send({ message: "Invalid email or password" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log("Entered password:", password);
//     console.log("Stored hashed password:", user.password);
//     console.log("Is password valid:", isPasswordValid);
//     if (!isPasswordValid) {
//       return res.status(401).send({ message: "Invalid password" });
//     }
//     const token = generateToken(user._id);
//     return res.status(200).send({ message: "Login successful", token: token });
//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).send({ message: "Internal server error, check for error" });
//   }
// }

// module.exports = { signUp, login };


const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(id) {
  return jwt.sign({ userId: id }, 'secretkey');
}

async function signUp(req, res) {
  const { email, name, password } = req.body;
  console.log(req.body, "printing requested body here")

  try {
    const existingUser = await User.findOne({ email });
    console.log("existingUser: printing here", existingUser)

    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }


    const user = await User.create({ email, name, password: password });
    console.log("printing password after creating", password )
    const token = generateToken(user._id);
    return res.status(201).send({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({ message: "Internal server error, check for error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log("login details", req.body)
  console.log("line no.37")

  try {
    const user = await User.findOne({ email });
    console.log(email, "printing email id here")
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);
    console.log("Is password valid:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    return res.status(200).send({ message: "Login successful", token: token });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({ message: "Internal server error, check for error" });
  }
}

module.exports = { signUp, login };
