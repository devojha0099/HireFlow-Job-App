const Application = require("../models/Application");
const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");

const STATUSES = ["Applied", "Shortlisted", "Interview", "Rejected"];
const isValidUrl = (value) => /^https?:\/\/\S+$/i.test(value);

// POST /api/applications/:jobId  (candidate)
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Business rule: closed jobs cannot receive applications.
  if (job.status !== "open") {
    res.status(400);
    throw new Error("This job is closed and no longer accepts applications");
  }

  // Use the resume sent with the request, or fall back to the one on the profile.
  const resumeUrl = (req.body.resumeUrl || req.user.resumeUrl || "").trim();
  if (!resumeUrl) {
    res.status(400);
    throw new Error("Please provide a resume URL (or save one in your profile)");
  }
  if (!isValidUrl(resumeUrl)) {
    res.status(400);
    throw new Error("Resume URL must start with http:// or https://");
  }

  // Friendly duplicate check. The unique index in the model is the real
  // safety net (the errorHandler turns error code 11000 into a 409).
  const already = await Application.findOne({ candidate: req.user._id, job: job._id });
  if (already) {
    res.status(409);
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    candidate: req.user._id,
    job: job._id,
    resumeUrl,
  });

  res.status(201).json({ application });
});

// GET /api/applications/my  (candidate) - ONLY my own applications
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate("job", "title company location salary jobType status") // replace the id with real job data
    .sort({ createdAt: -1 });

  res.json({ applications });
});

// GET /api/applications/job/:jobId  (recruiter, owner of the job only)
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (job.recruiter.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view applicants of this job");
  }

  const applications = await Application.find({ job: job._id })
    .populate("candidate", "name email skills education resumeUrl")
    .sort({ createdAt: -1 });

  res.json({ job, applications });
});

// PATCH /api/applications/:id/status  (recruiter, owner of the job only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${STATUSES.join(", ")}`);
  }

  // Populate the job so we can check who owns it.
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  if (application.job.recruiter.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this application");
  }

  application.status = status;
  await application.save();

  res.json({ application: { _id: application._id, status: application.status } });
});

// GET /api/applications/recruiter/stats  (recruiter) - numbers for dashboard cards
const getRecruiterStats = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).select("_id");
  const jobIds = jobs.map((j) => j._id);

  const [totalApplicants, shortlisted, interviews] = await Promise.all([
    Application.countDocuments({ job: { $in: jobIds } }),
    Application.countDocuments({ job: { $in: jobIds }, status: "Shortlisted" }),
    Application.countDocuments({ job: { $in: jobIds }, status: "Interview" }),
  ]);

  res.json({ stats: { totalJobs: jobs.length, totalApplicants, shortlisted, interviews } });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRecruiterStats,
};
