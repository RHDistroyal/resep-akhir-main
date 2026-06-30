import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Jika tidak ada pengguna yang login, redirect ke halaman login
  return loggedInUser ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;