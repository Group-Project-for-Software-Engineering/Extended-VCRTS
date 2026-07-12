//User object formatting and validation 

export function formatUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    userType: row.userType
  };
}
//------------------------------------------------------------------------------

export function validateUser(data) {
  if (!data.username || !data.password) {
    throw new Error("Username and password are required");
  }
}
