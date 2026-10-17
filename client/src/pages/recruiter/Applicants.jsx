import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobApplicants, updateApplicationStatus } from "../../redux/applicationSlice.js";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Rejected"];

const Applicants = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const { applicantsJob, applicants, applicantsStatus, applicantsError } = useSelector(
    (state) => state.applications
  );

  const [expandedId, setExpandedId] = useState(null); 
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    dispatch(fetchJobApplicants(id));
  }, [dispatch, id]);

  const handleStatusChange = async (applicationId, status) => {
    setStatusError(null);
    const result = await dispatch(updateApplicationStatus({ id: applicationId, status }));
    if (result.meta.requestStatus !== "fulfilled") setStatusError(result.payload);
  };

  if (applicantsStatus === "loading" || applicantsStatus === "idle") return <Loader />;
  if (applicantsStatus === "failed") return <ErrorMessage message={applicantsError} />;

  return (
    <div>
      <Link to="/recruiter" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to dashboard
      </Link>

      <div className="mb-6 mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Applicants: {applicantsJob?.title}</h1>
        {applicantsJob && <StatusBadge status={applicantsJob.status} />}
      </div>

      <ErrorMessage message={statusError} />

      {applicants.length === 0 ? (
        <EmptyState title="No applicants yet" description="Applications will appear here as candidates apply." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Candidate</th>
                <th className="px-5 py-3 font-semibold">Skills</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.map((app) => (
                <Fragment key={app._id}>
                  <tr>
                    <td className="px-5 py-3">
                      <p className="font-medium">{app.candidate?.name}</p>
                      <p className="text-xs text-slate-500">{app.candidate?.email}</p>
                    </td>
                    <td className="px-5 py-3">{app.candidate?.skills?.join(", ") || "-"}</td>
                    <td className="px-5 py-3">
                      <select
                        className="input w-auto py-1"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary px-3 py-1"
                          onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                        >
                          {expandedId === app._id ? "Hide" : "Profile"}
                        </button>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary px-3 py-1"
                        >
                          Resume
                        </a>
                      </div>
                    </td>
                  </tr>

                  {expandedId === app._id && (
                    <tr className="bg-slate-50">
                      <td colSpan={4} className="px-5 py-4 text-sm">
                        <p>
                          <span className="font-medium">Education:</span> {app.candidate?.education || "Not provided"}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium">Applied on:</span>{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium">Current status:</span> <StatusBadge status={app.status} />
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applicants;
