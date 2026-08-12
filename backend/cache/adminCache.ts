//Use of a cache for the admin. This prevents the overuse of api calls to the database for user information that didn't change
import { User } from "../models/User"

interface AdminCache {
  users: User[] | null;
  lastUpdated: number | null;
}

export const adminCache: AdminCache = {
  users: null,
  lastUpdated: null
};