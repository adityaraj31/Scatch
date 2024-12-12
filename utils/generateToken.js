const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET; // Ensure this environment variable is set
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: '1h', // Token expiration time
  });
};

module.exports = generateToken; // Correctly export the function
