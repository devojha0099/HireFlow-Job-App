const STYLES = {
  Applied: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-green-100 text-green-700",
  Interview: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  open: "bg-green-100 text-green-700",
  closed: "bg-slate-200 text-slate-600",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
      STYLES[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
