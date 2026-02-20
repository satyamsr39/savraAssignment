import { Link, useNavigate } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="w-64 h-screen bg-gray-950 text-white fixed">
      <h2 className="text-2xl p-4 font-bold border-b border-gray-600">
        Principal Panel
      </h2>

      <nav className="flex flex-col p-4 gap-4">
        <Link
          to="/principal/dashboard"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Dashboard
        </Link>

        <Link
          to="/principal/analysis"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Teacher Analysis
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 mt-6 p-2 rounded relative"
        >
          Logout
        </button>
      </nav>
    </div>
  )
}
