"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProblemCard } from "@/components/molecules/problem-card";

// Types to match our custom hook's state
interface Problem {
  id: string;
  title: string;
  topic: string;
  difficulty: number;
}

interface Kit {
  id: string;
  name: string;
  day_plan: Record<string, Problem[]>;
}

interface KitDisplayProps {
  kit: Kit;
}

const dayVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1, // Each problem card animates in one by one
    },
  },
};

export function KitDisplay({ kit }: KitDisplayProps) {
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/70">
          {kit.name}
        </h2>
        <p className="text-muted-foreground mt-2">
          Your universe of challenges awaits. Let's begin.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(kit.day_plan).map(([day, problems], index) => (
          <motion.div
            key={day}
            variants={dayVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
          >
            <Card className="bg-card/80 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Day {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {problems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    status="pending"
                  />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
