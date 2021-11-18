const router = require("express").Router();
const User = require("../models/User");
const { hashPassword, validatePass } = require("../bcrypt");

// REGISTER NEW USER
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      fullName: req.body.fullName,
      userName: req.body.userName,
      email: req.body.email,
      password: await hashPassword(req.body.password),
    });

    const user = await newUser.save();
    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      messaage: error.message,
    });
  }
});

// LOGIN A USER
router.post("/login", async (req, res) => {
  try {
    // Check if the supplied user email exist
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(400).json("Wrong credentials!");

    // Validate supplied password for existing user
    const validated = await validatePass(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...userDatails } = user._doc;

    res.status(200).json({
      status: "Success",
      userDatails,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      messaage: error.message,
    });
  }
});

module.exports = router;
