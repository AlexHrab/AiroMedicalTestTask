export const ObserverTrigger = ({ observerRef, position }) => (
  <div
    ref={observerRef}
    style={{
      height: position === "top" ? "100px" : "40px",
      width: position === "top" ? "100px" : "40px",
      position: position === "top" ? "absolute" : "static",
      top: position === "top" ? 0 : undefined,
      left: position === "top" ? 0 : undefined,
      marginTop: position === "bottom" ? "100px" : undefined,
      visibility: "hidden",
    }}
  />
);
