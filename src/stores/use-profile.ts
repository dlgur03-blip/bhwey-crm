"use client";

import { create } from "zustand";
import type { UserRole } from "@/types";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  profileImg: string | null;
}

interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
