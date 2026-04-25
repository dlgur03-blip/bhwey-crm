"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/stores/use-profile";
import type { UserRole } from "@/types";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { setProfile, setLoading } = useProfile();

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, name, role, phone, profile_img")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfile({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as UserRole,
          phone: profile.phone,
          profileImg: profile.profile_img,
        });
      } else {
        // 프로필이 없으면 auth 정보로 기본값
        setProfile({
          id: user.id,
          email: user.email ?? "",
          name:
            user.user_metadata?.full_name ??
            user.email?.split("@")[0] ??
            "사용자",
          role: "staff",
          phone: null,
          profileImg: user.user_metadata?.avatar_url ?? null,
        });
      }
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, setLoading]);

  return <>{children}</>;
}
