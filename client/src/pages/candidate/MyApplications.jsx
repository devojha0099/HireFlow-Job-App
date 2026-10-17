import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyApplications } from "../../redux/applicationSlice.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const MyApplications = () => {
  const dispatch = useDispatch();
  const { mine, mineStatus, mineError } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplications()); 
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Applications</h1>
      <p className="mb-6 text-sm text-slate-500">
        The status below comes from the database. It changes when a recruiter updates it.
      </p>

      <ErrorMessage message={mineError} />
      {mineStatus === "loading" && <Loader />}

      {mineStatus === "succeeded" && mine.length === 0 && (
        <EmptyState title="You haven't applied anywhere yet">
          <Link to="/candidate/jobs" className="btn btn-primary">
            Find jobs
          </Link>
        </EmptyState>
      )}

      {mine.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Job</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Applied on</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mine.map((app) => (
                <tr key={app._id}>
                  <td className="px-5 py-3 font-medium">
                    {app.job ? (
                      <Link to={`/candidate/jobs/${app.job._id}`} className="text-indigo-600 hover:underline">
                        {app.job.title}
                      </Link>
                    ) : (
                      "Job removed"
                    )}
                  </td>
                  <td className="px-5 py-3">{app.job?.company}</td>
                  <td className="px-5 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
