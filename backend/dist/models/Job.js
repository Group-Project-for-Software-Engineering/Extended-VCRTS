"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJob = formatJob;
exports.validateJob = validateJob;
// Format a DB row into a plain JS object (NOT a RowDataPacket)
function formatJob(row) {
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
function validateJob(data) {
    if (!data.description || !data.duration || !data.deadline) {
        throw new Error("Job is missing required fields");
    }
}
