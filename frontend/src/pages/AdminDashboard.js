import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiFetch } from "../utils/api";
import { toast } from "react-toastify";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm] = useState("");
  const [statusFilter] = useState("all");

  const fetchVisits = async () => {
    const response = await apiFetch("/admin/visits");
    if (response.ok) {
      const data = await response.json();
      setVisits(data);
    }
  };

  const fetchUsers = async () => {
    const response = await apiFetch("/admin/users");
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchVisits();
    fetchUsers();
  }, []);

  const reviewVisit = async (id, status) => {
    const response = await apiFetch(`/admin/visits/${id}?status=${status}`, {
      method: "PUT",
    });

    if (response.ok) {
      toast.success("Visit updated!");
      fetchVisits();
    } else {
      toast.error("Action failed");
    }
  };

  // Filter visits
  let filteredVisits = visits.filter((visit) =>
    visit.visitor_id
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (statusFilter !== "all") {
    filteredVisits = filteredVisits.filter(
      (visit) => visit.status === statusFilter,
    );
  }

  return (
    <DashboardLayout>
      {/* ===== VISIT SECTION ===== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Visit Review Panel
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredVisits.map((visit) => (
          <div
            key={visit.visit_id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
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
                  onClick={() => reviewVisit(visit.visit_id, "done")}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => reviewVisit(visit.visit_id, "rejected")}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== REGISTERED USERS SECTION ===== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registered
      </h2>

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
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 uppercase font-semibold">{user.role}</td>
                <td className="p-4 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
