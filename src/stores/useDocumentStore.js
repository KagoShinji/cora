import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uploadDocument,viewDocument,fetchDocument } from '../api/api';


export const useDocumentStore = create(
  persist(
    (set) => ({
      documents: [],
      loading: false,
      error: null,


       createDocument: async (file, title, notes) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('title', title);
          formData.append('notes', notes);

          const uploaded = await uploadDocument(formData);
          set({ isLoading: false });
          console.log(uploaded);
          return uploaded;
        } catch (err) {
          set({
            isLoading: false,
            error: err.message || 'Document upload failed',
          });
          throw err;
        }
      },

      fetchDocuments: async (status = null) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchDocument(status); // pass status
            set({ documents: data, loading: false });
        } catch (err) {
            console.error("Fetch documents failed:", err);
            set({
            loading: false,
            error: err.message || "Failed to load documents",
            });
        }
    },

     previewDocument: async (id) => {
        try {
            const blob = await viewDocument(id); // already a blob
            return blob;
        } catch (err) {
            console.error("View document error:", err);
            throw err;
        }
        }
    }),
    {
      name: 'document-storage', 
      partialize: (state) => ({
        documents: state.documents,
      }),
    }
  )
);

