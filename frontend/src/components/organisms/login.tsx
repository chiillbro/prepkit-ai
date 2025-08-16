"use client";
import { useAuth } from "@/hooks/use-auth";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export function Login() {
  const { supabase } = useAuth();
  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={["github"]} // Or other providers
      />
    </div>
  );
}
