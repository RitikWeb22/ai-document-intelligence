import { create } from 'zustand';

export const useDocumentStore = create((set, get) => ({
  selectedDocumentIds: [],
  activeCitation: null,
  isUploadModalOpen: false,

  toggleDocumentSelection: (id) => {
    const current = get().selectedDocumentIds;
    if (current.includes(id)) {
      set({ selectedDocumentIds: current.filter((docId) => docId !== id) });
    } else {
      set({ selectedDocumentIds: [...current, id] });
    }
  },

  selectAllDocuments: (ids) => {
    set({ selectedDocumentIds: ids });
  },

  clearDocumentSelection: () => {
    set({ selectedDocumentIds: [] });
  },

  setActiveCitation: (citation) => {
    set({ activeCitation: citation });
  },

  setUploadModalOpen: (isOpen) => {
    set({ isUploadModalOpen: isOpen });
  }
}));
