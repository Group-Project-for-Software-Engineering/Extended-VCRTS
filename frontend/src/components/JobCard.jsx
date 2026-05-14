import "./JobCard.css";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <p><strong>Job ID:</strong> {job.jobClientId}</p>
      <p><strong>Description:</strong> {job.jobDescription}</p>
      <p><strong>Deadline:</strong> {job.jobDeadline}</p>
      <p><strong>Duration:</strong> {job.approximateJobDuration}</p>
      <p><strong>Status:</strong> {job.jobStatus}</p>
    </div>
  );
}
