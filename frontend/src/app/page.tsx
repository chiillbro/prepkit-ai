"use client";

import { KitGenerator } from "@/components/organisms/kit-generator";
import { Login } from "@/components/organisms/login";
import { useAuth } from "@/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { session } = useAuth();
  const [authStatusChecked, setAuthStatusChecked] = useState(false);

  useEffect(() => {
    // This effect helps prevent a flicker between login and main content
    if (session !== undefined) {
      setAuthStatusChecked(true);
    }
  }, [session]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_farthest-side,hsl(var(--accent)_/_15%),transparent)] blur-2xl"></div>
      </div>

      <AnimatePresence mode="wait">
        {!authStatusChecked ? (
          <motion.div key="loader">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
          </motion.div>
        ) : !session ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Login />
          </motion.div>
        ) : (
          <motion.div
            key="generator"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <KitGenerator/>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
