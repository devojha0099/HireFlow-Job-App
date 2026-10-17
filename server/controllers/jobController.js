const Job = require("../models/Job");
const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const parseSkills = require("../utils/parseSkills");
const escapeRegex = require("../utils/escapeRegex");


const getOwnedJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (job.recruiter.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to modify this job");
  }
  return job;
};


const getJobs = asyncHandler(async (req, res) => {
  const { q, location, jobType } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 50);

  const filter = { status: "open" };

  if (q && q.trim()) {
    const regex = new RegExp(escapeRegex(q.trim()), "i"); 
    filter.$or = [{ title: regex }, { company: regex }, { skills: regex }];
  }
  if (location && location.trim()) {
    filter.location = new RegExp(escapeRegex(location.trim()), "i");
  }
  if (jobType) filter.jobType = jobType;

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 }) 
    .skip((page - 1) * limit) 
    .limit(limit); 

  res.json({ jobs, page, pages: Math.ceil(total / limit) || 1, total });
});

// GET /api/jobs/:id  (public)
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("recruiter", "name companyName");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json({ job });
});

// GET /api/jobs/mine  (recruiter) - only MY jobs, each with an applicantCount
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

  // Aggregation: group applications by job and count them.
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: "$job", count: { $sum: 1 } } },
  ]);
  const countMap = {};
  counts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  const result = jobs.map((job) => ({
    ...job.toObject(),
    applicantCount: countMap[job._id.toString()] || 0,
  }));

  res.json({ jobs: result });
});

// POST /api/jobs  (recruiter)
const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, jobType, salary, description, skills, status } = req.body;

  const job = await Job.create({
    title,
    company: company || req.user.companyName,
    location,
    jobType,
    salary,
    description,
    skills: parseSkills(skills),
    status: status === "closed" ? "closed" : "open",
    recruiter: req.user._id, 
  });

  res.status(201).json({ job });
});


const updateJob = asyncHandler(async (req, res) => {
  const job = await getOwnedJob(req, res);
  const { title, company, location, jobType, salary, description, skills, status } = req.body;


  if (title !== undefined) job.title = title;
  if (company !== undefined) job.company = company;
  if (location !== undefined) job.location = location;
  if (jobType !== undefined) job.jobType = jobType;
  if (salary !== undefined) job.salary = salary;
  if (description !== undefined) job.description = description;
  if (skills !== undefined) job.skills = parseSkills(skills);
  if (status !== undefined && ["open", "closed"].includes(status)) job.status = status;

  await job.save(); 
  res.json({ job });
});



const closeJob = asyncHandler(async (req, res) => {
  const job = await getOwnedJob(req, res);
  job.status = "closed";
  await job.save();
  res.json({ job });
});

module.exports = { getJobs, getJobById, getMyJobs, createJob, updateJob, closeJob };
