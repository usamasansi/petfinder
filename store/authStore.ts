import { create } from "zustand";

type AuthState = {
  authState: {
    authenticated: boolean | null;
    userId: number | null;
  };
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  authState: { authenticated: null, userId: null },
  onLogin: (username: string, password: string) => {},
  onLogout: () =>
    set((state) => ({
      authState: { ...state.authState, authenticated: false, username: null },
    })),
}));
