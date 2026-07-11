import "../styles/AdminUserCard.css";
//------------------------------------------------------------------------------
//For every user in the database that is not an admin, display their information to the admins on the admin home page

export default function AdminUserCard({ user }) {
  return (
    <div className="admin-user-card">
      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User Type:</strong> {user.userType}</p>
      <p><strong>User ID:</strong> {user.id}</p>

      {user.userType === "Owner" && (
        <>
          <p><strong>Vehicles:</strong></p>
          {user.vehicles.map(v => (
            <p key={v.id}>
              [Make: {v.make} || Model: {v.model} || VIN: {v.vin} ||
              Plate: {v.plate} || Year: {v.year} || Approx Time: {v.approxTime}]
            </p>
          ))}
        </>
      )}

      {user.userType === "Client" && (
        <>
          <p><strong>Jobs:</strong></p>
          {user.jobs.map(j => (
            <p key={j.id}>
              [Job ID: {j.id} || Duration: {j.duration} hrs ||
              Deadline: {j.deadline} || Description: {j.description}]
            </p>
          ))}
        </>
      )}
    </div>
  );
}
