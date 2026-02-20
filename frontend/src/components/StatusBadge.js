function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[normalized] || "bg-gray-100"
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
}

export default StatusBadge;
