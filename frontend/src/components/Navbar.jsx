import { Link } from "react-router-dom";
import "../styles/NavBar.css";
//------------------------------------------------------------------------------
//Creates a navbar at the top of every users screen 
//Different navbar depending on user type

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

        {/* Admin-only */}
        {userType === "Admin" && (
          <>
            <Link to="/admin/pending" className="nav-btn">Pending</Link>
            <Link to="/admin/removal" className="nav-btn">Remove Job/Vehicle</Link>
            <Link to="/dashboard" className="nav-btn">Dashboard</Link>
          </>
        )}

        {/* Owner-only */}
        {userType === "Owner" && (
          <Link to="/offer-vehicle" className="nav-btn">Offer Vehicle</Link>
        )}

        {/* Client-only */}
        {userType === "Client" && (
          <Link to="/submit-job" className="nav-btn">Submit Job</Link>
        )}

        {/* Shared */}
        <Link to="/notifications" className="nav-btn">Notifications</Link>

        {/* Logout */}
        <Link to="/login" className="nav-btn logout">Log Out</Link>
      </div>
    </nav>
  );
}
