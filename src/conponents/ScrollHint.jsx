export const ScrollHint = ({ direction, show }) => {
  if (!show) return null;

  const text =
    direction === "up"
      ? "↑ Scroll up to see previous breweries"
      : "↓ Scroll down to see more breweries";

  return (
    <div
      style={{
        textAlign: "center",
        color: "red",
        fontSize: "20px",
        marginTop: direction === "up" ? "10px" : "0",
        marginBottom: direction === "up" ? "10px" : "20px",
        animation: "blink 1.2s infinite",
        fontWeight: "700",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0%   { opacity: 1; }
            50%  { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `}
      </style>
      {text}
    </div>
  );
};
