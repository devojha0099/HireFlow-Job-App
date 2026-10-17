const Loader = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
    <span className="text-sm">{text}</span>
  </div>
);

export default Loader;
