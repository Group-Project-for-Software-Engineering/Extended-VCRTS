import "../styles/PendingCard.css";

export default function PendingCard({ req, reload }) {
  async function handleDecision(decision) {
    await fetch(`/api/admin/${decision}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: req.id, type: req.type })
    });

    reload();
  }

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
