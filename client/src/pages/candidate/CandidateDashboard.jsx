import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyApplications } from "../../redux/applicationSlice.js";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { mine, mineStatus, mineError } = useSelector((state) => state.applications);

  
  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const shortlisted = mine.filter((a) => a.status === "Shortlisted").length;
  const interviews = mine.filter((a) => a.status === "Interview").length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
      <p className="mb-6 text-sm text-slate-500">Here is your job search at a glance.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Applications" value={mine.length} />
        <StatCard label="Shortlisted" value={shortlisted} />
        <StatCard label="Interviews" value={interviews} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Recent applications</h2>
      <ErrorMessage message={mineError} />
      {mineStatus === "loading" && <Loader />}

      {mineStatus === "succeeded" && mine.length === 0 && (
        <EmptyState title="No applications yet" description="Find a job you like and apply.">
          <Link to="/candidate/jobs" className="btn btn-primary">
            Browse jobs
          </Link>
        </EmptyState>
      )}

      {mine.length > 0 && (
        <div className="card divide-y divide-slate-100 p-0">
          {mine.slice(0, 5).map((app) => (
            <div key={app._id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-medium">{app.job?.title || "Job removed"}</p>
                <p className="text-sm text-slate-500">{app.job?.company}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
