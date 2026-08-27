import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  fullName: string;
  initials: string;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function deriveFullName(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata as { full_name?: unknown; name?: unknown } | undefined;
  const value = typeof meta?.full_name === "string" ? meta.full_name : meta?.name;
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function initialsFrom(name: string, email?: string | null): string {
  const source = name.trim() || (email ?? "").split("@")[0]?.replace(/[._-]+/g, " ") || "";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    const fullName = deriveFullName(user);
    return {
      session,
      user,
      loading,
      fullName,
      initials: initialsFrom(fullName, user?.email),
      isAdmin: (user?.app_metadata as Record<string, unknown> | undefined)?.["is_admin"] === true,
      signOut: async () => {
        await supabase.auth.signOut();
        setSession(null);
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
