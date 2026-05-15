import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import AdminPending from "./pages/AdminPending";
import AdminRemoval from "./pages/AdminRemoval";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import OfferVehicle from "./pages/OfferVehicle";
import SubmitJob from "./pages/SubmitJob";

export default function App() {
  const [user, setUser] = useState(null);

  function ProtectedRoute({ children, roles }) {
    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.userType)) {
      return <Navigate to="/home" replace />;
    }

    return children;
  }

  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/*Register*/}
        <Route path="/register" element={<Register />} />

        {/* Home (Client or Owner) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute roles={["Client", "Owner", "Admin"]}>
              <Home user={user} />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["Client", "Owner", "Admin"]}>
              <Notifications user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin Home */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminHome user={user} />
            </ProtectedRoute>
          }
        />


        {/* Admin: Pending */}
        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminPending user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin: Removal */}
        <Route
          path="/admin/removal"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminRemoval user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offer-vehicle"
          element={
            <ProtectedRoute roles={["Owner"]}>
              <OfferVehicle user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-job"
          element={
            <ProtectedRoute roles={["Client"]}>
              <SubmitJob user={user} />
            </ProtectedRoute>
          }
        />


        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}
