import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-left">
        <h1>VCRTS</h1>
        <p>
          The Vehicular Cloud Real-Time System (VCRTS) utilizes unused computing
          power from parked vehicles by pooling their resources and renting them
          out to clients who need computation.
        </p>
      </div>

      <div className="about-right">
        <h2>Get Started</h2>
        <a className="btn" href="/login">Login</a>
        <a className="btn" href="/register">Create an Account</a>
      </div>
    </div>
  );
}