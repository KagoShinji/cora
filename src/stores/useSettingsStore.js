import { create } from 'zustand'
import { fetchSettings, uploadLogo, changeNameAPI, changeColorAPI } from '../api/settings'

export const useAppSettingsStore = create((set) => ({
  name: "",
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
      set({ name: updated.name, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  changeColor: async (primaryColor, secondaryColor) => {
    try {
      const updated = await changeColorAPI(primaryColor, secondaryColor);
      set({
        primary_color: updated.primary_color,
        secondary_color: updated.secondary_color,
      });
    } catch (error) {
      console.error("Failed to change colors:", error);
    }
  },
}))
