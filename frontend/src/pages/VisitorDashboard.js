import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiFetch } from "../utils/api";
import { toast } from "react-toastify";
import StatusBadge from "../components/StatusBadge";
import { AuthContext } from "../context/AuthContext";

function VisitorDashboard() {
  const { user } = useContext(AuthContext);

  const [visits, setVisits] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    setLoading(true);
    const response = await apiFetch("/visits/my-visits");
    if (response.ok) {
      const data = await response.json();
      setVisits(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch("/visits/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("Visit uploaded successfully!");
      setFile(null);
      fetchVisits();
    } else {
      toast.error("Upload failed");
    }
  };

  const pendingCount = visits.filter((v) => v.status === "pending").length;
  const doneCount = visits.filter((v) => v.status === "done").length;
  const rejectedCount = visits.filter((v) => v.status === "rejected").length;

  return (
    <DashboardLayout>
      {/* ===== Top Section ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Track your visits and monitor approval status.
        </p>
      </div>

      {/* ===== Status Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-yellow-100 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
          <p className="text-4xl font-bold mt-3 text-yellow-800">
            {pendingCount}
          </p>
        </div>

        <div className="bg-green-100 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-green-700">Approved</h3>
          <p className="text-4xl font-bold mt-3 text-green-800">{doneCount}</p>
        </div>

        <div className="bg-red-100 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-red-700">Rejected</h3>
          <p className="text-4xl font-bold mt-3 text-red-800">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* ===== Upload Section ===== */}
      <div className="bg-white p-8 rounded-2xl shadow-md mb-12">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Upload New Visit
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-3 rounded-lg w-full"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Upload
          </button>
        </div>
      </div>

      {/* ===== Visit Cards ===== */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">My Visits</h2>

      {loading ? (
        <p className="text-gray-500">Loading visits...</p>
      ) : visits.length === 0 ? (
        <p className="text-gray-500">No visits uploaded yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visits.map((visit) => (
            <div
              key={visit.visit_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <img
                src={`http://127.0.0.1:8000/${visit.image_path}`}
                alt="visit"
                className="w-full h-52 object-cover"
              />

              <div className="p-5 flex justify-between items-center">
                <p>
                  Status: <StatusBadge status={visit.status} />
                </p>
                {/* <span className="text-sm text-gray-400">
                  ID: {visit.visit_id.slice(-5)}
                </span> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default VisitorDashboard;
