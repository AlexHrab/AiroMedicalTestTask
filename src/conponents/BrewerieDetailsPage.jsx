import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBrewerieDetails } from "../infrastructure/breweriesApi";
import { LiaBeerSolid } from "react-icons/lia";
import { HiPhone } from "react-icons/hi";
import { HiGlobeAlt } from "react-icons/hi";
import { MdLocationPin } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";

export function BrewerieDetailsPage() {
  const { brewerieId } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await getBrewerieDetails(brewerieId);
        setBrewery(result);
      } catch (error) {
        console.error("Error fetching brewery details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [brewerieId]);

  if (loading) return <p>Loading brewery details...</p>;
  if (!brewery) return <p>Brewery not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Link
        to="/breweries"
        style={{ marginBottom: "20px", display: "inline-block" }}
      >
        ← Back to List
      </Link>

      <div
        style={{
          padding: "30px",
          border: "2px solid #ddd",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          animation: "fadeIn 0.6s ease-out forwards",
        }}
      >
        <LiaBeerSolid style={{ fontSize: "50px" }} />
        <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>
          {brewery.name}
        </h1>
        <div style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>
          <FaMapLocationDot /> {brewery.address_1}{" "}
          {brewery.address_2 && brewery.address_2}, {brewery.city},{" "}
          {brewery.state} {brewery.postal_code}, {brewery.country}
        </div>
        <div style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}>
          Type: {brewery.brewery_type}
        </div>
        {brewery.phone && (
          <div
            style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}
          >
            <HiPhone /> {brewery.phone}
          </div>
        )}
        {brewery.website_url && (
          <div
            style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}
          >
            <HiGlobeAlt />{" "}
            <a
              href={brewery.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {brewery.website_url}
            </a>
          </div>
        )}
        {brewery.latitude && brewery.longitude && (
          <div style={{ fontSize: "16px", color: "#555", marginTop: "15px" }}>
            <MdLocationPin /> Location: {brewery.latitude}, {brewery.longitude}
          </div>
        )}
      </div>
    </div>
  );
}
