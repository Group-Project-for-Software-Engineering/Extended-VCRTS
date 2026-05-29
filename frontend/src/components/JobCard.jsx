import "../styles/JobCard.css";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <p><strong>Job ID:</strong> {job.id}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Deadline:</strong> {job.deadline}</p>
      <p><strong>Duration:</strong> {job.duration}</p>
      <p><strong>Status:</strong> {"pending"}</p>
    </div>
  );
}
