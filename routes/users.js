const router = require("express").Router();
const User = require("../models/User");
const { hashPassword } = require("../bcrypt");

// GET A SINGLE USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...userDetails } = user._doc;
    res.status(200).json({
      status: "Success",
      userDetails,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE A USER
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const { password, ...user } = updatedUser._doc;

      res.status(200).json({
        status: "Success",
        user,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json({
      status: "Error",
      message: "You have no permission to update this account",
    });
  }
});

// DELETE A USER
router.delete("/:id", async (req, res) => {
  // Check if the user with the supplied ID exists
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
          status: "Success",
          message: "User deleted successfully!",
        });
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You have no permission to delete this account");
  }
});

module.exports = router;
