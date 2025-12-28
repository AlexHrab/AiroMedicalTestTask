import "./App.css";
import { BreweriesList } from "./conponents/BreweriesList";
import { Routes, Route } from "react-router-dom";
import { BrewerieDetailsPage } from "./conponents/BrewerieDetailsPage";
import { HomePage } from "./conponents/HomePage";
import { useEffect } from "react";
import { useBreweriesStore } from "./infrastructure/breweriesStore";

function App() {
  const { breweries, fetchBreweries } = useBreweriesStore();

  useEffect(() => {
    if (breweries.length === 0) {
      fetchBreweries();
    }
  }, [breweries.length, fetchBreweries]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/breweries" element={<BreweriesList />} />
      <Route path="/breweries/:brewerieId" element={<BrewerieDetailsPage />} />
    </Routes>
  );
}

export default App;
