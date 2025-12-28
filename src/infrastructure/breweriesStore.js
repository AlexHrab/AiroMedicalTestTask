import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBreweriesList } from "./breweriesApi";

export const useBreweriesStore = create(
  persist(
    (set, get) => ({
      breweries: [],
      backupBreweries: [],
      loading: false,
      error: null,
      backupPage: 2,

      fetchBreweries: async () => {
        set({ loading: true, error: null });

        try {
          const [data, backupData] = await Promise.all([
            getBreweriesList(15, 1),
            getBreweriesList(15, 2),
          ]);

          set({
            breweries: data,
            backupBreweries: backupData,
            loading: false,
            backupPage: 2,
          });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      loadNextBackupPage: async () => {
        const { backupPage } = get();

        try {
          const nextPageData = await getBreweriesList(15, backupPage + 1);

          if (nextPageData.length > 0) {
            set((state) => ({
              backupBreweries: [...state.backupBreweries, ...nextPageData],
              backupPage: backupPage + 1,
            }));
          }

          return nextPageData.length;
        } catch (err) {
          console.error("Error loading backup page:", err);
          return 0;
        }
      },

      getUniqueBreweries: (candidates, existingIds) => {
        return candidates.filter((b) => !existingIds.has(b.id));
      },

      refillFromBackup: async (neededCount) => {
        const { backupBreweries, breweries, getUniqueBreweries } = get();
        const existingIds = new Set(breweries.map((b) => b.id));

        let itemsToAdd = [];
        let remainingNeeded = neededCount;

        const availableBackup = getUniqueBreweries(
          backupBreweries,
          existingIds
        );

        if (availableBackup.length > 0) {
          const takeCount = Math.min(availableBackup.length, remainingNeeded);
          itemsToAdd = availableBackup.slice(0, takeCount);
          remainingNeeded -= takeCount;
        }

        const MAX_ATTEMPTS = 5;
        let attempts = 0;

        while (remainingNeeded > 0 && attempts < MAX_ATTEMPTS) {
          const loadedCount = await get().loadNextBackupPage();

          if (loadedCount === 0) break;

          const { backupBreweries: updatedBackup } = get();
          const currentIds = new Set([
            ...existingIds,
            ...itemsToAdd.map((b) => b.id),
          ]);

          const newAvailable = getUniqueBreweries(updatedBackup, currentIds);
          const takeCount = Math.min(newAvailable.length, remainingNeeded);

          if (takeCount > 0) {
            const additionalItems = newAvailable.slice(
              availableBackup.length,
              availableBackup.length + takeCount
            );
            itemsToAdd = [...itemsToAdd, ...additionalItems];
            remainingNeeded -= takeCount;
          }

          attempts++;
        }

        if (itemsToAdd.length > 0) {
          const usedIds = new Set(itemsToAdd.map((b) => b.id));

          set((state) => ({
            breweries: [...state.breweries, ...itemsToAdd],
            backupBreweries: state.backupBreweries.filter(
              (b) => !usedIds.has(b.id)
            ),
          }));
        }

        return itemsToAdd.length;
      },

      removeBreweriesByIds: async (ids, onNotify) => {
        if (!ids || ids.length === 0) return;

        const deletedCount = ids.length;
        const idsSet = new Set(ids);

        set((state) => ({
          breweries: state.breweries.filter((b) => !idsSet.has(b.id)),
        }));

        onNotify?.(
          `Deleted ${deletedCount} ${
            deletedCount === 1 ? "brewery" : "breweries"
          }`,
          "error"
        );

        try {
          const addedCount = await get().refillFromBackup(deletedCount);

          if (addedCount > 0) {
            onNotify?.(
              `Added ${addedCount} new ${
                addedCount === 1 ? "brewery" : "breweries"
              }`,
              "success"
            );
          }
        } catch (err) {
          console.error("Error refilling breweries:", err);
          onNotify?.("Failed to load replacement breweries", "warning");
        }
      },

      reset: () =>
        set({
          breweries: [],
          backupBreweries: [],
          loading: false,
          error: null,
          backupPage: 2,
        }),
    }),

    {
      name: "breweries-storage",
      partialize: (state) => ({
        breweries: state.breweries,
        backupBreweries: state.backupBreweries,
        backupPage: state.backupPage,
      }),
    }
  )
);
