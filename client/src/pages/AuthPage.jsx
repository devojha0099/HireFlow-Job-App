import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthError, loginUser, registerUser } from "../redux/authSlice.js";
import ErrorMessage from "../components/ErrorMessage.jsx";


const AuthPage = ({ role, mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, initializing } = useSelector((state) => state.auth);

  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, role, mode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isRegister
      ? registerUser({ ...form, role })
      : loginUser({ email: form.email, password: form.password, role });

    const result = await dispatch(action);
    
    if (result.meta.requestStatus === "fulfilled") navigate(`/${role}`);
  };

  if (!initializing && user) return <Navigate to={`/${user.role}`} replace />;

  const otherRole = role === "candidate" ? "recruiter" : "candidate";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 block text-center text-2xl font-bold text-indigo-600">
          HireFlow
        </Link>

        <div className="card">
          <h1 className="text-xl font-semibold capitalize">
            {role} {isRegister ? "registration" : "login"}
          </h1>
          <p className="mb-5 mt-1 text-sm text-slate-500">
            {isRegister ? "Create your account to get started." : "Welcome back! Please sign in."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={error} />

            {isRegister && (
              <div>
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input id="name" name="name" className="input" value={form.name} onChange={handleChange} required />
              </div>
            )}

            {isRegister && role === "recruiter" && (
              <div>
                <label className="label" htmlFor="companyName">
                  Company name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  className="input"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
                className="input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            {isRegister ? "Already have an account? " : "New here? "}
            <Link
              to={`/${role}/${isRegister ? "login" : "register"}`}
              className="font-medium text-indigo-600 hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Are you a {otherRole}?{" "}
          <Link to={`/${otherRole}/${mode}`} className="font-medium text-indigo-600 hover:underline">
            Go to {otherRole} {mode}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
