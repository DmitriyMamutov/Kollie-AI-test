import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Item {
  id: string;
  name: string;
  type: 'text' | 'file';
}

interface KnowledgeBase {
  id: string;
  create_date: Date;
  name: string;
  total_items: number;
  items: Item[];
  linked_agents: object[];
}

interface Store {
  knowledgeBases: KnowledgeBase[];
  currentPage: number;
  itemsPerPage: number;
  addKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  addItemToKnowledgeBase: (knowledgeBaseId: string, item: Item) => void;
  deleteItemFromKnowledgeBase: (knowledgeBaseId: string, itemId: string) => void;
  setCurrentPage: (page: number) => void;
}

const useStore = create(
  persist<Store>(
    (set) => ({
      knowledgeBases: [],
      currentPage: 1,
      itemsPerPage: 5,
      addKnowledgeBase: (knowledgeBase: KnowledgeBase) =>
        set((state) => ({
          knowledgeBases: [...state.knowledgeBases, knowledgeBase],
        })),
      addItemToKnowledgeBase: (knowledgeBaseId: string, item: Item) =>
        set((state) => {
          const updatedKnowledgeBases = state.knowledgeBases.map((kb) =>
            kb.id === knowledgeBaseId
              ? { ...kb, items: [...kb.items, item], total_items: kb.total_items + 1 }
              : kb
          );
          return { knowledgeBases: updatedKnowledgeBases };
        }),
      deleteItemFromKnowledgeBase: (knowledgeBaseId: string, itemId: string) =>
        set((state) => {
          const updatedKnowledgeBases = state.knowledgeBases.map((kb) =>
            kb.id === knowledgeBaseId
              ? {
                  ...kb,
                  items: kb.items.filter((item) => item.id !== itemId),
                  total_items: kb.total_items - 1,
                }
              : kb
          );
          return { knowledgeBases: updatedKnowledgeBases };
        }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
    }),
    {
      name: 'knowledge-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
