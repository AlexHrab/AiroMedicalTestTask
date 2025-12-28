import { useState, useRef } from "react";
import { useBreweriesStore } from "../infrastructure/breweriesStore";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BreweryItem } from "./BreweryItem";
import { DeleteButton } from "./DeleteButton";
import {
  showNotification,
  useItemDimensions,
  useDeleteAnimation,
  useScrollPagination,
} from "../infrastructure/helpers";
import { ScrollHint } from "./ScrollHint";
import { ObserverTrigger } from "./ObserverTrigger";

export function BreweriesList() {
  const { breweries, loading, removeBreweriesByIds } = useBreweriesStore();
  const headerRef = useRef(null);
  const location = useLocation();
  const [selectedIds, setSelectedIds] = useState([]);

  const { itemHeight, containerHeight } = useItemDimensions(headerRef);
  const {
    visibleStart,
    setVisibleStart,
    observeBottomRef,
    observeTopRef,
    scrollDirection,
  } = useScrollPagination(breweries, loading, headerRef);
  const showDelete = useDeleteAnimation(selectedIds);

  const handleRightClick = (e, id) => {
    e.preventDefault();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    await removeBreweriesByIds(selectedIds, showNotification);
    setSelectedIds([]);

    const newLength = breweries.length;

    if (visibleStart >= newLength) {
      const lastPageStart = Math.floor(Math.max(0, newLength - 1) / 5) * 5;
      setVisibleStart(lastPageStart);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer />

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {visibleStart > 0 && (
        <ObserverTrigger observerRef={observeTopRef} position="top" />
      )}

      <div ref={headerRef}>
        <h1>Breweries List</h1>
      </div>

      <ScrollHint direction="up" show={visibleStart > 0} />

      <div style={{ minHeight: `${containerHeight}px`, position: "relative" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {breweries.map((brewery, index) => {
            const isVisible = index >= visibleStart && index < visibleStart + 5;
            const isSelected = selectedIds.includes(brewery.id);
            const delay = (index - visibleStart) * 0.1;

            return (
              <BreweryItem
                key={brewery.id}
                brewery={brewery}
                index={index}
                itemHeight={itemHeight}
                isSelected={isSelected}
                isVisible={isVisible}
                scrollDirection={scrollDirection}
                delay={delay}
                location={location}
                handleRightClick={handleRightClick}
              />
            );
          })}
        </ul>

        <ScrollHint
          direction="down"
          show={visibleStart + 5 < breweries.length}
        />

        {visibleStart + 5 < breweries.length && (
          <ObserverTrigger observerRef={observeBottomRef} position="bottom" />
        )}
      </div>

      <DeleteButton
        show={showDelete}
        selectedCount={selectedIds.length}
        onDelete={handleDeleteSelected}
      />
    </div>
  );
}
