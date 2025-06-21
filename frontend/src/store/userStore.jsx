import { create } from 'zustand';

const useUserStore = create(set => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
  logout: (callback) => {
    set({ usuario: null });
    if (typeof callback === 'function') callback();
  },
}));

export default useUserStore;