import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uploadDocument,viewDocument,fetchDocument,fetchDocumentsByTitle } from '../api/api';


export const useDocumentStore = create(
  persist(
    (set) => ({
      documents: [],
      loading: false,
      error: null,
      titleDocuments: [],
      refreshTrigger: 0,
      refreshDocumentInfo: () => set({ refreshTrigger: Date.now() }),


       createDocument: async (file, titleId, keywords) => {
          set({ isLoading: true, error: null });
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title_id", titleId);  
            formData.append("keywords", JSON.stringify(keywords));  

            const uploaded = await uploadDocument(formData);
            set({ isLoading: false });
            console.log(uploaded);
            return uploaded;
          } catch (err) {
            set({
              isLoading: false,
              error: err.message || "Document upload failed",
            });
            throw err;
          }
        },

      fetchDocuments: async (status = null) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchDocument(status); 
            set({ documents: data, loading: false });
        } catch (err) {
            console.error("Fetch documents failed:", err);
            set({
            loading: false,
            error: err.message || "Failed to load documents",
            });
        }
    },
    fetchByTitle: async (titleName) => {
    try {
      const data = await fetchDocumentsByTitle(titleName);
      set({ titleDocuments: data });
    } catch (error) {
      console.error("Error in fetchByTitle:", error);
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

