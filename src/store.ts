import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IItem {
  id: string;
  name: string;
  type: 'text' | 'file';
}

interface IKnowledgeBase {
  id: string;
  create_date: Date;
  name: string;
  total_items: number;
  items: IItem[];
  linked_agents: object[];
}

interface IStore {
  knowledgeBases: IKnowledgeBase[];
  currentPage: number;
  itemsPerPage: number;
  addKnowledgeBase: (knowledgeBase: IKnowledgeBase) => void;
  addItemToKnowledgeBase: (knowledgeBaseId: string, item: IItem) => void;
  deleteItemFromKnowledgeBase: (knowledgeBaseId: string, itemId: string) => void;
  setCurrentPage: (page: number) => void;
}

const useStore = create(
  persist<IStore>(
    (set) => ({
      knowledgeBases: [],
      currentPage: 1,
      itemsPerPage: 5,
      addKnowledgeBase: (knowledgeBase: IKnowledgeBase) =>
        set((state) => ({
          knowledgeBases: [...state.knowledgeBases, knowledgeBase],
        })),
      addItemToKnowledgeBase: (knowledgeBaseId: string, item: IItem) =>
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
