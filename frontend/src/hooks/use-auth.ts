// frontend/src/hooks/use-auth.ts
"use client";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { session, supabase };
}
