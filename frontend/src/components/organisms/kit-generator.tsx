"use client";

import { TopicSelector } from "@/components/molecules/topic-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateKitMutation } from "@/lib/redux/features/kits-api-slice"; // Import the new hook
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";

const AVAILABLE_TOPICS = [
  "Arrays",
  "Strings",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Hash Tables",
  "Hash Maps",
  "Linked Lists",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export function KitGenerator() {
  const router = useRouter(); // Initialize router
  const [days, setDays] = useState(3);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "arrays",
    "dp",
  ]);

  // Use the RTK Query mutation hook
  const [createKit, { isLoading, error }] = useCreateKitMutation();

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // unwrap() will return the successful result or throw the error
      const result = await createKit({
        days,
        topics: selectedTopics,
      }).unwrap();
      // On success, redirect to the new kit's page
      router.push(`/kits/${result.kit_id}`);
    } catch (err) {
      // Error is already handled by the hook's 'error' state, but we can log it too
      console.error("Failed to create kit:", err);
    }
  };

  // The error object from RTK Query might be structured differently
  const errorMessage =
    error && "data" in error
      ? (error.data as any).detail
      : "An error occurred.";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-center space-y-3"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/70">
          PrepKit AI
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your interview success starts here. Get a focused, personalized plan
          to conquer any coding challenge.
        </p>
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8 bg-card border border-border p-8 rounded-2xl shadow-2xl shadow-black/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-3">
          <Label htmlFor="days" className="text-base font-semibold">
            1. Select Your Timeline
          </Label>
          <Input
            id="days"
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            min="1"
            required
            className="bg-background/80 h-12 text-base ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            2. Choose Your Topics
          </Label>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {AVAILABLE_TOPICS.map((topic) => (
              <TopicSelector
                key={topic}
                topic={topic}
                isSelected={selectedTopics.includes(topic)}
                onTopicChange={handleTopicChange}
              />
            ))}
          </motion.div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-all duration-300 rounded-xl shadow-[0_0_25px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.6)]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isLoading ? "loading" : "ready"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading
                ? "Building Your Universe..."
                : "Generate My Prep Plan"}
            </motion.span>
          </AnimatePresence>
        </Button>
      </motion.form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
