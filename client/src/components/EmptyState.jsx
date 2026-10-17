const EmptyState = ({ title, description, children }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <h3 className="text-base font-semibold text-slate-700">{title}</h3>
    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    {children && <div className="mt-4">{children}</div>}
  </div>
);

export default EmptyState;
