const express = require("express");
const {
    getRequestsByRecipient,
    getRequestsByRequester,
    
 sendRequest,
 answerRequest
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendRequest);
router.route("/recipient").get(protect, getRequestsByRecipient);
router.route("/requester").get(protect, getRequestsByRequester);
router.route("/").put(protect, answerRequest);


module.exports = router;