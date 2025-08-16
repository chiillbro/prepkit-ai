// frontend/src/hooks/use-code-submission.ts
import { useState } from "react";

interface SubmissionParams {
  problemId: string;
  code: string;
  language: "python" | "javascript";
}

interface SubmissionResult {
  status: string;
  execution_time_ms: number | null;
  memory_kb: number | null;
  output: string;
}

export function useCodeSubmission() {
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCode = async ({
    problemId,
    code,
    language,
  }: SubmissionParams) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem_id: problemId, code, language }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Submission failed.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitCode, result, isLoading, error };
}
