//Job object implementation and formatting

export function formatJob(row) {
  return {
    id: row.id,
    clientId: row.clientId,
    description: row.description,
    duration: row.duration,
    deadline: row.deadline,
    timestamp: row.timestamp,
    assignedVehicleId: row.assignedVehicleId,
    status: row.status
  };
}
//-------------------------------------------------------

export function validateJob(data) {
  if (!data.description || !data.duration || !data.deadline) {
    throw new Error("Job is missing required fields");
  }
}