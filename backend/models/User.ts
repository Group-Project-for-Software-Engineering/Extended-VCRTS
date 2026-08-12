//User object formatting and validation 
import { RowDataPacket } from "mysql2";


export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  userType: "Admin" | "Client" | "Owner";
  vehicles?: any[];
  jobs?: any[];
}

export interface NewUserInput {
  username: string;
  password: string;
  email?: string;
  userType?: "Client" | "Owner"; // Admin is manually inserted
}

export function formatUser(row: any) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    userType: row.userType
  };
}

export function validateUser(data: NewUserInput): void {
  if (!data.username || !data.password) {
    throw new Error("Username and password are required");
  }
}
