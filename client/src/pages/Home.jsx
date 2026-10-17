import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="text-2xl font-bold text-indigo-600">HireFlow</span>
        {user && (
          <Link to={`/${user.role}`} className="btn btn-primary">
            Go to dashboard
          </Link>
        )}
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Find your next opportunity.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          HireFlow connects candidates with companies that are hiring right now. Candidates apply
          in a click, recruiters manage jobs and applicants in one place.
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 pb-16 md:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-semibold">I'm a Candidate</h2>
          <p className="mt-2 text-sm text-slate-600">
            Search jobs, apply with your resume and track every application status.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/candidate/login" className="btn btn-primary">
              Candidate Login
            </Link>
            <Link to="/candidate/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">I'm a Recruiter</h2>
          <p className="mt-2 text-sm text-slate-600">
            Post jobs, review applicants and move them through your hiring pipeline.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/recruiter/login" className="btn btn-primary">
              Recruiter Login
            </Link>
            <Link to="/recruiter/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
