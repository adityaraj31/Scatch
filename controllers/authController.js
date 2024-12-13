const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(401).send("You already have an account, please login");
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          res.send("user created successfully");
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Find user by email
    let user = await userModel.findOne({ email: email });
    if (!user) return res.status(400).send("Email or password incorrect");

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate token and send in cookie
      let token = generateToken(user);
      res.cookie("token", token);
      return res.redirect("/shop");
    } else {
      return res.status(400).send("Email or password incorrect");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};
