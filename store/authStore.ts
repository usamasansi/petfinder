import { create } from "zustand";

type AuthState = {
  authState: {
    authenticated: boolean | null;
    userId: number | null;
  };
  setAuthenticatedUser: (authenticated: boolean, userId: number) => void;
  onLogout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  authState: { authenticated: null, userId: null },
  setAuthenticatedUser: (authenticated: boolean, userId: number) => {
    set(() => ({
      authState: { authenticated, userId },
    }));
  },
  onLogout: () =>
    set((state) => ({
      authState: { ...state.authState, authenticated: false, username: null },
    })),
}));
