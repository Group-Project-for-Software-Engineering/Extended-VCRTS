//Use of a cache for the admin. This prevents the overuse of api calls to the database for user information that didn't change

export const adminCache = {
  users: null,
  lastUpdated: null
};