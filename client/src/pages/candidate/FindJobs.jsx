import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobs } from "../../redux/jobSlice.js";
import useDebounce from "../../hooks/useDebounce.js";
import JobCard from "../../components/JobCard.jsx";
import Pagination from "../../components/Pagination.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const FindJobs = () => {
  const dispatch = useDispatch();
  const { list, listStatus, listError } = useSelector((state) => state.jobs);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);
  const debouncedLocation = useDebounce(location);

  useEffect(() => {
    dispatch(
      fetchJobs({
        q: debouncedSearch,
        location: debouncedLocation,
        jobType,
        page,
        limit: 6,
      })
    );
  }, [dispatch, debouncedSearch, debouncedLocation, jobType, page]);

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Find a job you love</h1>
      <p className="mb-6 text-sm text-slate-500">Explore opportunities from companies hiring now.</p>

      <div className="card mb-6 grid gap-3 sm:grid-cols-3">
        <input
          className="input"
          placeholder="Job title, company or skill"
          value={search}
          onChange={onFilterChange(setSearch)}
        />
        <input
          className="input"
          placeholder="Location (e.g. Gurugram, Remote)"
          value={location}
          onChange={onFilterChange(setLocation)}
        />
        <select className="input" value={jobType} onChange={onFilterChange(setJobType)}>
          <option value="">All job types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <ErrorMessage message={listError} />
      {listStatus === "loading" && <Loader text="Searching jobs..." />}

      {listStatus === "succeeded" && list.jobs.length === 0 && (
        <EmptyState title="No jobs found" description="Try a different keyword, location or job type." />
      )}

      {listStatus !== "loading" && list.jobs.length > 0 && (
        <>
          <p className="mb-3 text-sm text-slate-500">{list.total} job(s) found</p>
          <div className="grid gap-4 md:grid-cols-2">
            {list.jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          <Pagination page={list.page} pages={list.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default FindJobs;
