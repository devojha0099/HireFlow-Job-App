import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobById } from "../../redux/jobSlice.js";
import { applyToJob, fetchMyApplications } from "../../redux/applicationSlice.js";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const JobDetails = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { current: job, currentStatus, currentError } = useSelector((state) => state.jobs);
  const myApplications = useSelector((state) => state.applications.mine);

  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(fetchMyApplications()); 
  }, [dispatch, id]);

 
  const myApplication = myApplications.find((app) => app.job?._id === id);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError(null);
    setSubmitting(true);

    const result = await dispatch(applyToJob({ jobId: id, resumeUrl }));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyApplications()); 
    } else {
      setApplyError(result.payload);
    }
    setSubmitting(false);
  };

  if (currentStatus === "loading" || currentStatus === "idle") return <Loader />;
  if (currentStatus === "failed") return <ErrorMessage message={currentError} />;
  if (!job) return null;

  return (
    <div className="max-w-3xl">
      <Link to="/candidate/jobs" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to jobs
      </Link>

      <div className="card mt-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-slate-600">
              {job.company} &middot; {job.location}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">{job.jobType}</span>
          {job.salary && <span className="rounded-full bg-slate-100 px-3 py-1">{job.salary}</span>}
        </div>

        <h2 className="mt-6 font-semibold">About the role</h2>
        <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{job.description}</p>

        {job.skills?.length > 0 && (
          <>
            <h2 className="mt-6 font-semibold">Required skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded bg-slate-100 px-2.5 py-1 text-sm text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

     
      <div className="card mt-5">
        {myApplication ? (
          <div className="flex items-center justify-between">
            <p className="font-medium">You have applied to this job.</p>
            <StatusBadge status={myApplication.status} />
          </div>
        ) : job.status === "closed" ? (
          <p className="text-slate-600">This job is closed and no longer accepts applications.</p>
        ) : (
          <form onSubmit={handleApply} className="space-y-3">
            <h2 className="font-semibold">Apply for this job</h2>
            <ErrorMessage message={applyError} />
            <div>
              <label className="label" htmlFor="resumeUrl">
                Resume link
              </label>
              <input
                id="resumeUrl"
                type="url"
                className="input"
                placeholder="https://drive.google.com/..."
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                Prefilled from your profile. You can use a different link for this job.
              </p>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
