const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRecruiterStats,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Every route here needs a logged-in user.
router.use(protect);

// Candidate routes
router.get("/my", authorizeRoles("candidate"), getMyApplications);
router.post("/:jobId", authorizeRoles("candidate"), applyToJob);

// Recruiter routes
router.get("/recruiter/stats", authorizeRoles("recruiter"), getRecruiterStats);
router.get("/job/:jobId", authorizeRoles("recruiter"), getJobApplicants);
router.patch("/:id/status", authorizeRoles("recruiter"), updateApplicationStatus);

module.exports = router;
