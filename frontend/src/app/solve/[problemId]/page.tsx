// frontend/src/app/solve/[problemId]/page.tsx
"use client";

import { ProblemSolvingTemplate } from "@/components/templates/problem-solving-template";
import { useGetProblemByIdQuery } from "@/lib/redux/features/problems-api-slice";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function SolvePage() {
  const params = useParams();
  const problemId = params.problemId as string;

  const {
    data: problem,
    isLoading,
    isError,
  } = useGetProblemByIdQuery(problemId, {
    skip: !problemId,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Problem not found.
      </div>
    );
  }

  return <ProblemSolvingTemplate problem={problem} />;
}
