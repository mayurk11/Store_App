import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiFetch } from "../utils/api";
import { toast } from "react-toastify";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);   // ✅ Added
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ===== Fetch Visits =====
  const fetchVisits = async () => {
    const response = await apiFetch("/admin/visits");
    if (response.ok) {
      const data = await response.json();
      setVisits(data);
    }
  };

  // ===== Fetch Registered Users =====
  const fetchUsers = async () => {
    const response = await apiFetch("/admin/users");
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchVisits();
    fetchUsers();   // ✅ Important
  }, []);

  // ===== Approve / Reject Visit =====
  const reviewVisit = async (id, status) => {
    const response = await apiFetch(
      `/admin/visits/${id}?status=${status}`,
      { method: "PUT" }
    );

    if (response.ok) {
      toast.success("Visit updated!");
      fetchVisits();
    } else {
      toast.error("Action failed");
    }
  };

  // ===== Filtering Logic =====
  let filteredVisits = visits.filter((visit) =>
    visit.visitor_id
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (statusFilter !== "all") {
    filteredVisits = filteredVisits.filter(
      (visit) => visit.status === statusFilter
    );
  }

  return (
    <DashboardLayout>

      {/* ===== VISIT SECTION ===== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Visit Review Panel
      </h2>

      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by Visitor ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

        </div>
      </div>

      {/* Visit Cards */}
      {filteredVisits.length === 0 ? (
        <p className="text-gray-500 mb-12">No visits found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredVisits.map((visit) => (
            <div
              key={visit.visit_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={`http://127.0.0.1:8000/${visit.image_path}`}
                alt="visit"
                className="w-full h-52 object-cover"
              />

              <div className="p-5 space-y-4">

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Visitor ID</span>
                  <span className="font-semibold text-gray-800">
                    {visit.visitor_id}
                  </span>
                </div>

                <StatusBadge status={visit.status} />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() =>
                      reviewVisit(visit.visit_id, "done")
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      reviewVisit(visit.visit_id, "rejected")
                    }
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== REGISTERED USERS SECTION ===== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registered Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users registered.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registered</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="p-4 text-gray-600">
                    {user.email}
                  </td>
                  <td className="p-4 uppercase font-semibold text-blue-600">
                    {user.role}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </DashboardLayout>
  );
}

export default AdminDashboard;
