const express = require("express");
const multer = require("multer");
const { 
  getSavings,
  addSaving,
  editSaving,
  deleteSaving,
} = require('../controllers/savingController');

const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage }); // Initialize multer with the storage configuration

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
router.get("/", getSavings); // Use the getSavings function from savingController
router.post("/", upload.single("photo"), addSaving); // Use the addSaving function
router.put("/:id", upload.single("photo"), editSaving); // Use the editSaving function
router.delete("/:id", deleteSaving); // Use the deleteSaving function

module.exports = router; // Export the router
