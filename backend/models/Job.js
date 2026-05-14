export function formatJob(row) {
  return {
    id: row.id,
    clientId: row.clientId,
    description: row.description,
    duration: row.duration,
    deadline: row.deadline,
    timestamp: row.timestamp
  };
}

export function validateJob(data) {
  if (!data.description || !data.duration || !data.deadline) {
    throw new Error("Job is missing required fields");
  }
}