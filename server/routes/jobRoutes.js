const express = require("express");
const {
  getJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  closeJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getJobs); 

router.get("/mine", protect, authorizeRoles("recruiter"), getMyJobs);

router.get("/:id", getJobById); 

router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);
router.patch("/:id/close", protect, authorizeRoles("recruiter"), closeJob);

module.exports = router;
