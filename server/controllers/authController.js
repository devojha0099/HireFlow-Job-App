const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const parseSkills = require("../utils/parseSkills");

const ALLOWED_ROLES = ["candidate", "recruiter"];


const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  companyName: user.companyName,
  skills: user.skills,
  education: user.education,
  resumeUrl: user.resumeUrl,
});

const isValidUrl = (value) => /^https?:\/\/\S+$/i.test(value);

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, companyName } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Name, email, password and role are required");
  }



  if (!ALLOWED_ROLES.includes(role)) {
    res.status(400);
    throw new Error("Role must be candidate or recruiter");
  }

  if (role === "recruiter" && !companyName?.trim()) {
    res.status(400);
    throw new Error("Company name is required for recruiters");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password, 
    role,
    companyName: role === "recruiter" ? companyName : undefined,
  });

  res.status(201).json({ token: generateToken(user._id), user: userResponse(user) });
});



const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }



  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");


  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (role && user.role !== role) {
    res.status(403);
    throw new Error(`This is a ${user.role} account. Please use the ${user.role} login page.`);
  }

  res.json({ token: generateToken(user._id), user: userResponse(user) });
});


const getMe = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});



const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, skills, education, resumeUrl, companyName } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400);
      throw new Error("Name cannot be empty");
    }
    user.name = name;
  }

  if (user.role === "candidate") {
    if (skills !== undefined) user.skills = parseSkills(skills);
    if (education !== undefined) user.education = education;
    if (resumeUrl !== undefined) {
      if (resumeUrl && !isValidUrl(resumeUrl)) {
        res.status(400);
        throw new Error("Resume URL must start with http:// or https://");
      }
      user.resumeUrl = resumeUrl;
    }
  }

  if (user.role === "recruiter" && companyName !== undefined) {
    if (!companyName.trim()) {
      res.status(400);
      throw new Error("Company name cannot be empty");
    }
    user.companyName = companyName;
  }

  await user.save();
  res.json({ user: userResponse(user) });
});

module.exports = { register, login, getMe, updateProfile };
