import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/authSlice.js";
import ErrorMessage from "../components/ErrorMessage.jsx";


const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    skills: "",
    education: "",
    resumeUrl: "",
    companyName: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        skills: (user.skills || []).join(", "),
        education: user.education || "",
        resumeUrl: user.resumeUrl || "",
        companyName: user.companyName || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const payload =
      user.role === "candidate"
        ? { name: form.name, skills: form.skills, education: form.education, resumeUrl: form.resumeUrl }
        : { name: form.name, companyName: form.companyName };

    const result = await dispatch(updateProfile(payload));
    if (result.meta.requestStatus === "fulfilled") {
      setMessage({ type: "success", text: "Profile updated successfully." });
    } else {
      setMessage({ type: "error", text: result.payload });
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="mb-6 text-sm text-slate-500">Signed in as {user.email}</p>

      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4">
        {message.type === "error" && <ErrorMessage message={message.text} />}
        {message.type === "success" && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message.text}
          </div>
        )}

        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className="input" value={form.name} onChange={handleChange} required />
        </div>

        {user.role === "recruiter" && (
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

        {user.role === "candidate" && (
          <>
            <div>
              <label className="label" htmlFor="skills">
                Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                className="input"
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label" htmlFor="education">
                Education
              </label>
              <input
                id="education"
                name="education"
                className="input"
                placeholder="B.E. Computer Science"
                value={form.education}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label" htmlFor="resumeUrl">
                Resume link
              </label>
              <input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                className="input"
                placeholder="https://drive.google.com/..."
                value={form.resumeUrl}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-slate-500">
                Paste a public link to your resume (Google Drive, Dropbox...). File upload is a Phase 2 feature.
              </p>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Update profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
