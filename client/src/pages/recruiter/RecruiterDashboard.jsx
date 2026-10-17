import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { closeJob, fetchMyJobs } from "../../redux/jobSlice.js";
import { fetchRecruiterStats } from "../../redux/applicationSlice.js";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { mine: jobs, mineStatus, mineError } = useSelector((state) => state.jobs);
  const stats = useSelector((state) => state.applications.stats);

  useEffect(() => {
    dispatch(fetchMyJobs());
    dispatch(fetchRecruiterStats());
  }, [dispatch]);

  const handleClose = async (job) => {
    if (!window.confirm(`Close "${job.title}"? Candidates will no longer be able to apply.`)) return;
    await dispatch(closeJob(job._id));
    dispatch(fetchRecruiterStats());
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <p className="text-sm text-slate-500">{user?.companyName} hiring workspace</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          + Post a job
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My jobs" value={stats.totalJobs} />
        <StatCard label="Applicants" value={stats.totalApplicants} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Interviews" value={stats.interviews} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">My job listings</h2>
      <ErrorMessage message={mineError} />
      {mineStatus === "loading" && <Loader />}

      {mineStatus === "succeeded" && jobs.length === 0 && (
        <EmptyState title="You haven't posted any jobs" description="Post your first job to start receiving applications.">
          <Link to="/recruiter/jobs/new" className="btn btn-primary">
            Post a job
          </Link>
        </EmptyState>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="card flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{job.title}</h3>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-sm text-slate-500">
                {job.location} &middot; {job.jobType} &middot; {job.applicantCount} applicant(s)
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-primary">
                Applicants
              </Link>
              <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-secondary">
                Edit
              </Link>
              {job.status === "open" && (
                <button onClick={() => handleClose(job)} className="btn btn-danger">
                  Close
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
