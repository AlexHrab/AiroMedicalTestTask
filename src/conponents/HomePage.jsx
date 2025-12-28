import { Link } from "react-router-dom";
import { LiaBeerSolid } from "react-icons/lia";

export function HomePage() {
  return (
    <>
      <LiaBeerSolid style={{ fontSize: "150px" }} />
      <h1 style={{ fontSize: "38px", color: "#333", marginBottom: "10px" }}>
        Welcome to brewery guide
      </h1>
      <Link to={`/breweries`}>
        <p
          style={{
            border: "2px solid #ddd",
            padding: "20px 10px",
            fontSize: "30px",
            borderRadius: "16px",
          }}
        >
          Go to the list of breweries
        </p>
      </Link>
    </>
  );
}
