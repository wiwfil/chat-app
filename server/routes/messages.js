const express = require("express");
const multer  = require('multer')
require("dotenv").config();


const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect,sendMessage);

module.exports = router;