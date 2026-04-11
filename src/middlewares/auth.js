const jwt = require("jsonwebtoken");
const User = require("../model/user"); 

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid !!!");
    }

    const decodedobj = jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedobj;

    const user = await User.findById(_id); // 👈 correct use

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = userAuth;