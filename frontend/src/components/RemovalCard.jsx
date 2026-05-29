import "../styles/RemovalCard.css";

export default function RemovalCard({ item, reload }) {
  async function removeItem() {
    await fetch("/api/admin/removal/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    reload();
  }

  return (
    <div className="removal-card">
      <p dangerouslySetInnerHTML={{ __html: item.formatted }} />

      <button className="remove-btn" onClick={removeItem}>
        Remove
      </button>
    </div>
  );
}
