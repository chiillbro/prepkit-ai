"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Code } from "lucide-react";
import Link from "next/link";

// interface Problem {
//   id: string;
//   title: string;
//   topic: string;
//   difficulty: number;
// }

// interface ProblemCardProps {
//   problem: Problem;
//   status: "pending" | "solved" | "skipped"; // We'll use this later
// }

const difficultyMap = {
  1: {
    label: "Easy",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  2: {
    label: "Easy",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  3: {
    label: "Medium",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  4: { label: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  5: { label: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function ProblemCard({ problem, status }: any) {
  const diff = difficultyMap[problem.difficulty as keyof typeof difficultyMap];

  return (
    // <motion.div
    //   variants={cardVariants}
    //   className="flex items-center justify-between p-4 bg-card rounded-lg border border-border transition-all hover:border-accent/50 hover:bg-secondary/50"
    // >
    //   <div className="flex items-center space-x-4">
    //     <CheckCircle2
    //       className={`h-6 w-6 transition-colors ${
    //         status === "solved" ? "text-accent" : "text-muted-foreground/50"
    //       }`}
    //     />
    //     <div>
    //       <p className="font-semibold text-foreground">{problem.title}</p>
    //       <div className="flex items-center space-x-2 mt-1">
    //         <Badge variant="secondary" className="capitalize">
    //           {problem.topic}
    //         </Badge>
    //         <Badge variant="outline" className={diff.color}>
    //           {diff.label}
    //         </Badge>
    //       </div>
    //     </div>
    //   </div>
    //   <Button
    //     variant="ghost"
    //     size="icon"
    //     className="hover:bg-accent/20 hover:text-accent"
    //   >
    //     <Code className="h-5 w-5" />
    //     <span className="sr-only">Solve Problem</span>
    //   </Button>
    // </motion.div>

    <motion.div
      variants={cardVariants}
      className="flex items-center justify-between p-4 bg-card rounded-lg border border-border transition-all hover:border-accent/50 hover:bg-secondary/50"
    >
      <div className="flex items-center space-x-4">
        <CheckCircle2
          className={`h-6 w-6 transition-colors ${
            status === "solved" ? "text-accent" : "text-muted-foreground/50"
          }`}
        />
        <div>
          <p className="font-semibold text-foreground">{problem.title}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="secondary" className="capitalize">
              {problem.topic}
            </Badge>
            <Badge variant="outline" className={diff.color}>
              {diff.label}
            </Badge>
          </div>
        </div>
      </div>
      {/* Wrap the Button in a Link component */}
      <Link href={`/solve/${problem.id}`} passHref>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="hover:bg-accent/20 hover:text-accent"
        >
          <a>
            <Code className="h-5 w-5" />
            <span className="sr-only">Solve Problem</span>
          </a>
        </Button>
      </Link>
    </motion.div>
  );
}
