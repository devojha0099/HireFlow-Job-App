import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createJob, fetchJobById, updateJob } from "../../redux/jobSlice.js";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { current, currentStatus, currentError } = useSelector((state) => state.jobs);

  const [form, setForm] = useState({
    title: "",
    company: user?.companyName || "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    skills: "",
    status: "open",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) dispatch(fetchJobById(id));
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && current && current._id === id) {
      setForm({
        title: current.title,
        company: current.company,
        location: current.location,
        jobType: current.jobType,
        salary: current.salary || "",
        description: current.description,
        skills: (current.skills || []).join(", "),
        status: current.status,
      });
    }
  }, [isEdit, current, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const action = isEdit ? updateJob({ id, ...form }) : createJob(form);
    const result = await dispatch(action);

    setSaving(false);
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/recruiter");
    } else {
      setError(result.payload);
    }
  };

  if (isEdit && (currentStatus === "loading" || (currentStatus === "idle" && !current))) return <Loader />;
  if (isEdit && currentStatus === "failed") return <ErrorMessage message={currentError} />;

  return (
    <div>
      <h1 className="text-2xl font-bold">{isEdit ? "Edit job" : "Post a new job"}</h1>
      <p className="mb-6 text-sm text-slate-500">Fill in the details candidates will see.</p>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4">
        <ErrorMessage message={error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="title">
              Job title
            </label>
            <input id="title" name="title" className="input" placeholder="MERN Stack Developer" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="company">
              Company
            </label>
            <input id="company" name="company" className="input" value={form.company} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="location">
              Location
            </label>
            <input id="location" name="location" className="input" placeholder="Gurugram or Remote" value={form.location} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="jobType">
              Job type
            </label>
            <select id="jobType" name="jobType" className="input" value={form.jobType} onChange={handleChange}>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="salary">
              Salary
            </label>
            <input id="salary" name="salary" className="input" placeholder="4-7 LPA" value={form.salary} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="status">
              Status
            </label>
            <select id="status" name="status" className="input" value={form.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="skills">
            Skills (comma separated)
          </label>
          <input id="skills" name="skills" className="input" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={handleChange} />
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="input"
            placeholder="Responsibilities and role details"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Post job"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/recruiter")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
