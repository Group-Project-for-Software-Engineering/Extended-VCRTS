import "../styles/PendingCard.css";
//------------------------------------------------------------------------------
//For admin use only. Admin can see pending vehicles or jobs on the pending page on their navbar
//admin can accept or reject them

export default function PendingCard({ req, reload }) {

  //api call for accept or reject action based on admin decision on pending screen
  async function handleDecision(decision) {
    await fetch(`/api/admin/${decision}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: req.id, type: req.type })
    });

    reload();
  }
  //---------------------------------------------------------------

  return (
    <div className="pending-card">
      <p dangerouslySetInnerHTML={{ __html: req.formatted }} />

      <div className="pending-buttons">
        <button className="accept-btn" onClick={() => handleDecision("approve")}>
          Accept
        </button>

        <button className="reject-btn" onClick={() => handleDecision("reject")}>
          Reject
        </button>
      </div>
    </div>
  );
}
