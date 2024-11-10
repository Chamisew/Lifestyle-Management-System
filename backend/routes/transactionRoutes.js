const express = require("express");
const multer = require("multer");
const { addTransaction, getTransactions, deleteTransaction } = require("../controllers/transactionController");

const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to filename
  },
});


router.use(authenticateToken);
const path = require("path");

// Configure multer for file uploads

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("image"), addTransaction);
router.get("/", getTransactions);
router.delete('/:id', deleteTransaction); 


module.exports = router;
