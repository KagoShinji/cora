import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchSettings, uploadLogo,changeNameAPI } from '../api/settings'

export const useAppSettingsStore = create(
  persist(
    (set) => ({
      name: null,
      logo_path: null,
      primary_color: null,
      secondary_color: null,

      getSettings: async () => {
        try {
          const data = await fetchSettings()
          set({
            name: data.name,
            logo_path: data.logo_path,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
          })
        } catch (error) {
          console.error("Failed to fetch settings:", error)
        }
      },

      changeLogo: async (file) => {
        try {
          const updated = await uploadLogo(file)
          set({ logo_path: updated.logo_path })
        } catch (error) {
          console.error('Failed to upload logo:', error)
        }
      },
      changeName: async (newName) => {
        set({ isLoading: true });
        try {
            const updated = await changeNameAPI(newName);
            set({ name: updated.name, isLoading: false }); // ✅ directly update name
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
        }
    }),
    {
      name: 'app-settings-store',
    }
  )
)
