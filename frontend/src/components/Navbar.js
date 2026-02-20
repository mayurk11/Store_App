import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full shadow">
          SV
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Store Visit System
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Role Badge */}
        <span className="px-4 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
          {user?.role}
        </span>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs">
              Log In
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;
