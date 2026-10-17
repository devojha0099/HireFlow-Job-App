import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice.js";


const NAV_LINKS = {
  candidate: [
    { to: "/candidate", label: "Dashboard", end: true },
    { to: "/candidate/jobs", label: "Find Jobs" },
    { to: "/candidate/applications", label: "My Applications" },
    { to: "/candidate/profile", label: "My Profile" },
  ],
  recruiter: [
    { to: "/recruiter", label: "Dashboard", end: true },
    { to: "/recruiter/jobs/new", label: "Post a Job" },
    { to: "/recruiter/profile", label: "My Profile" },
  ],
};


const DashboardLayout = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate(`/${role}/login`);
  };

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div>
          <span className="text-xl font-bold text-indigo-600">HireFlow</span>
          <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-2 md:min-h-[calc(100vh-57px)] md:w-56 md:flex-col md:border-b-0 md:border-r md:p-4">
          {NAV_LINKS[role].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
