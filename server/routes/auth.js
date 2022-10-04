const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  onlyFriends,
  updateUser
} = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/update").put(protect,updateUser)
router.route("/friends").get(protect,onlyFriends)
router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;