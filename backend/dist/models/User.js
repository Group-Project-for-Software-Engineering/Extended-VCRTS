"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUser = formatUser;
exports.validateUser = validateUser;
function formatUser(row) {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        userType: row.userType
    };
}
function validateUser(data) {
    if (!data.username || !data.password) {
        throw new Error("Username and password are required");
    }
}
