import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          Staff Punches Management System
        </h1>

        <p className="text-gray-700 mb-6">
          A role-based Admin & Staff management system designed to track daily
          attendance, manage staff records, and monitor punch-in and punch-out
          activities securely.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Staff Punch System by Bittu Rana
      </p>
    </div>
  );
};

export default Home;
