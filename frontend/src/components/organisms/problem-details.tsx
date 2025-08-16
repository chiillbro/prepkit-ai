import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProblemDetails({ problem }: { problem: any }) {
  return (
    <Card className="h-full bg-card/50 border-border overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{problem.title}</CardTitle>
        <div className="flex items-center space-x-2 pt-2">
          <Badge variant="default" className="capitalize">
            {problem.topic}
          </Badge>
          <Badge variant="default">{problem.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="prose prose-invert max-w-none">
        <p>{problem.description}</p>
      </CardContent>
    </Card>
  );
}
