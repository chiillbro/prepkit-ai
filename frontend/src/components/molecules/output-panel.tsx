// frontend/src/components/molecules/output-panel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Check, X, Clock, Zap } from "lucide-react";

interface SubmissionResult {
  status: string;
  execution_time_ms: number | null;
  memory_kb: number | null;
  output: string;
}

interface OutputPanelProps {
  result: SubmissionResult | null;
  isLoading: boolean;
  error: string | null;
}

export function OutputPanel({ result, isLoading, error }: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground animate-pulse">
        Running test cases...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Execution Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return (
      <div className="p-4 text-muted-foreground">
        Click "Run Code" to see the output.
      </div>
    );
  }

  const isSuccess = result.status === "Accepted";

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <h3
          className={`text-xl font-bold flex items-center gap-2 ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
        >
          {isSuccess ? <Check /> : <X />}
          {result.status}
        </h3>
        <div className="flex gap-4 text-muted-foreground text-sm">
          {result.execution_time_ms != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {result.execution_time_ms.toFixed(2)} ms
            </span>
          )}
          {result.memory_kb != null && (
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              {result.memory_kb} KB
            </span>
          )}
        </div>
      </div>
      <Card className="bg-background/80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {result.output}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
