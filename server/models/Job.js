const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    company: { type: String, required: [true, "Company is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    salary: { type: String, trim: true }, 
    description: { type: String, required: [true, "Description is required"] },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ["open", "closed"], default: "open" },

    
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
