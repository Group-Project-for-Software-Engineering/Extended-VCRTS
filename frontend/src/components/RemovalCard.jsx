import "../styles/RemovalCard.css";
//------------------------------------------------------------------------------
//Creates a card for the admin so they can remove a job or vehicle once it has been accepted and is already in the system

export default function RemovalCard({ item, reload }) {

  //api call to remove job or vehicle when remove button is clicked
  async function removeItem() {
    await fetch("/api/admin/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    reload();
  }
  //-------------------------------------------

  return (
    <div className="removal-card">
      <p dangerouslySetInnerHTML={{ __html: item.formatted }} />

      <button className="remove-btn" onClick={removeItem}>
        Remove
      </button>
    </div>
  );
}
