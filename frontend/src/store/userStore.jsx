import { create } from 'zustand';

const useUserStore = create(set => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null }),
}));

export default useUserStore;