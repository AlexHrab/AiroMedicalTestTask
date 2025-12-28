import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

const ANIMATION_DELAY = 10;
const OBSERVER_THRESHOLD = 0.8;
const SCROLL_DEBOUNCE_MS = 800;
const SCROLL_DELAY = 100;

export const calculateDimensions = (headerHeight) => {
  const padding = 25 * 2;
  const border = 2 * 2;
  const margin = 25;
  const extra = padding + border + margin;
  const availableHeight = window.innerHeight - headerHeight;
  const itemHeight = (availableHeight - extra * 5) / 5;
  const containerHeight = itemHeight * 5 + extra * 5;
  return { itemHeight, containerHeight };
};

export const showNotification = (message, type) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  if (type === "error") {
    toast.error(message, options);
  } else if (type === "success") {
    toast.success(message, options);
  }
};

export const useItemDimensions = (headerRef) => {
  const [itemHeight, setItemHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    function updateItemHeight() {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const { itemHeight: newItemHeight, containerHeight: newContainerHeight } =
        calculateDimensions(headerHeight);
      setItemHeight(newItemHeight);
      setContainerHeight(newContainerHeight);
    }

    updateItemHeight();
    window.addEventListener("resize", updateItemHeight);
    return () => window.removeEventListener("resize", updateItemHeight);
  }, []);

  return { itemHeight, containerHeight };
};

export const useDeleteAnimation = (selectedIds) => {
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (selectedIds.length > 0) {
      const timeout = setTimeout(() => setShowDelete(true), ANIMATION_DELAY);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setShowDelete(false), ANIMATION_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [selectedIds]);

  return showDelete;
};

export const useScrollPagination = (breweries, loading, headerRef) => {
  const [visibleStart, setVisibleStart] = useState(0);
  const observeBottomRef = useRef(null);
  const observeTopRef = useRef(null);
  const lastChangeTime = useRef(0);
  const scrollDirection = useRef("down");

  const scrollToNext = () => {
    const now = Date.now();
    if (now - lastChangeTime.current < SCROLL_DEBOUNCE_MS) return;
    const newVisibleStart = visibleStart + 5;
    if (newVisibleStart >= breweries.length) return;
    lastChangeTime.current = now;
    scrollDirection.current = "down";
    setVisibleStart(newVisibleStart);
    setTimeout(() => {
      if (headerRef.current) {
        const headerTop =
          headerRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: headerTop,
          behavior: "smooth",
        });
      }
    }, SCROLL_DELAY);
  };

  const scrollToPrev = () => {
    const now = Date.now();
    if (now - lastChangeTime.current < SCROLL_DEBOUNCE_MS) return;
    const newVisibleStart = visibleStart - 5;
    if (newVisibleStart < 0) return;
    lastChangeTime.current = now;
    scrollDirection.current = "up";
    setVisibleStart(newVisibleStart);
    setTimeout(() => {
      if (headerRef.current) {
        const headerTop =
          headerRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: headerTop,
          behavior: "smooth",
        });
      }
    }, SCROLL_DELAY);
  };

  useEffect(() => {
    if (loading) return;

    const observerBottom = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) scrollToNext();
        });
      },
      { threshold: OBSERVER_THRESHOLD }
    );

    const observerTop = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) scrollToPrev();
        });
      },
      { threshold: OBSERVER_THRESHOLD }
    );

    if (observeBottomRef.current && visibleStart + 5 < breweries.length) {
      observerBottom.observe(observeBottomRef.current);
    }

    if (observeTopRef.current && visibleStart > 0) {
      observerTop.observe(observeTopRef.current);
    }

    return () => {
      observerBottom.disconnect();
      observerTop.disconnect();
    };
  }, [loading, visibleStart, breweries.length]);

  return {
    visibleStart,
    setVisibleStart,
    observeBottomRef,
    observeTopRef,
    scrollDirection,
  };
};
