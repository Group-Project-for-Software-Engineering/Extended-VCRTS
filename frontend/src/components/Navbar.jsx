import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ user }) {
  const userType = user.userType;

  return (
    <nav className={`navbar navbar-${userType.toLowerCase()}`}>
      <div className="navbar-left">
        <h1>VCRTS - {userType}</h1>
      </div>

      <div className="navbar-center">
        <span className="welcome">Welcome, {user.username}!</span>
      </div>

      <div className="navbar-right">
        {/* Home */}
        {userType === "Admin" ? (
          <Link to="/admin/home" className="nav-btn">Home</Link>
        ) : (
          <Link to="/home" className="nav-btn">Home</Link>
        )}

        {/* Admin-only buttons */}
        {userType === "Admin" && (
          <>
            <Link to="/admin/pending" className="nav-btn">Pending</Link>
            <Link to="/admin/removal" className="nav-btn">Remove Job/Vehicle</Link>
          </>
        )}

        {/* Owner-only */}
        {userType === "Owner" && (
          <Link to="/owner/offer-vehicle" className="nav-btn">Offer Vehicle</Link>
        )}

        {/* Client-only */}
        {userType === "Client" && (
          <Link to="/client/submit-job" className="nav-btn">Submit Job</Link>
        )}

        {/* Shared */}
        <Link to="/schedule" className="nav-btn">Schedule</Link>
        <Link to="/settings" className="nav-btn">Settings</Link>

        {/* Shared */}
        <Link to="/notifications">Notifications</Link>

        {/* Logout */}
        <Link to="/" className="nav-btn logout">Log Out</Link>
      </div>
    </nav>
  );
}
