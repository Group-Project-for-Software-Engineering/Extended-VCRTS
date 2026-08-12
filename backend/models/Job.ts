import { RowDataPacket } from "mysql2";

// Represents a row returned from MySQL
export interface Job extends RowDataPacket {
  id: number;
  clientId: number;
  description: string;
  duration: number;
  deadline: string;
  timestamp: string;
  assignedVehicleId?: number | null;
  status: string;
}

// Represents input when creating a new job
export interface NewJobInput {
  clientId: number;
  description: string;
  duration: number;
  deadline: string;
}

// Format a DB row into a plain JS object (NOT a RowDataPacket)
export function formatJob(row: any) {
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

// Validate input for job creation
export function validateJob(data: NewJobInput): void {
  if (!data.description || !data.duration || !data.deadline) {
    throw new Error("Job is missing required fields");
  }
}
