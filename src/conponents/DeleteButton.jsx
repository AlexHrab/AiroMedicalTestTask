export const DeleteButton = ({ show, selectedCount, onDelete }) => (
  <div
    style={{
      height: "80px",
      width: "150px",
      position: "fixed",
      top: 0,
      right: "150px",
      display: "flex",
      border: "2px solid #ddd",
      background: "#ddd",
      borderRadius: "12px",
      justifyContent: "center",
      alignItems: "center",
      borderTopWidth: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(-120%)",
      transition: "all 0.5s ease-out",
      zIndex: 1000,
      pointerEvents: selectedCount > 0 ? "auto" : "none",
    }}
  >
    <button
      style={{
        height: "40px",
        width: "80px",
        background: "red",
        color: "white",
      }}
      onClick={onDelete}
    >
      Delete
    </button>
  </div>
);
