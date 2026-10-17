import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div className="card flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
      <p className="text-sm text-slate-600">
        {job.company} &middot; {job.location}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
          {job.jobType}
        </span>
        {job.salary && <span className="font-medium text-slate-700">{job.salary}</span>}
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>

    <Link to={`/candidate/jobs/${job._id}`} className="btn btn-primary mt-5">
      View &amp; Apply
    </Link>
  </div>
);

export default JobCard;
