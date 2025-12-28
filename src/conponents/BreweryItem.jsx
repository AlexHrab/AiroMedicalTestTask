import { Link } from "react-router-dom";

export const BreweryItem = ({
  brewery,
  itemHeight,
  isSelected,
  isVisible,
  scrollDirection,
  delay,
  location,
  handleRightClick,
}) => (
  <li key={brewery.id}>
    <Link
      to={`/breweries/${brewery.id}`}
      state={location}
      onContextMenu={(e) => handleRightClick(e, brewery.id)}
      style={{
        height: itemHeight,
        marginBottom: "25px",
        padding: "25px",
        border: "2px solid #ddd",
        borderRadius: "12px",
        backgroundColor: isSelected ? "#ffdddd" : "#fff",
        animation: isVisible
          ? scrollDirection.current === "down"
            ? `fadeInDown 0.6s ease-out forwards ${delay}s`
            : `fadeInUp 0.6s ease-out forwards ${delay}s`
          : "none",
        display: isVisible ? "block" : "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <strong style={{ fontSize: "22px", color: "#333" }}>
        {brewery.name}
      </strong>
    </Link>
  </li>
);
