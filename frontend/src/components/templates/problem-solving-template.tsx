// frontend/src/components/templates/problem-solving-template.tsx
"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CodeEditorPanel } from "../organisms/code-editor-panel";
import { ProblemDetails } from "../organisms/problem-details";

// Define the shape of our problem data
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  topic: string;
}

export function ProblemSolvingTemplate({ problem }: { problem: Problem }) {
  return (
    // <div className="flex h-screen w-screen bg-background text-foreground p-2 gap-2">
    //   <div className="w-1/3 flex-shrink-0">
    //     <ProblemDetails problem={problem} />
    //   </div>
    //   <div className="flex-grow">
    //     <CodeEditorPanel problemId={problem.id} />
    //   </div>
    // </div>
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={40} minSize={20}>
          <div className="h-full p-2">
            <ProblemDetails problem={problem} />
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-transparent flex items-center justify-center group">
          <div className="w-1 h-10 bg-border rounded-full transition-all group-hover:bg-accent group-data-[resize-handle-state=drag]:bg-accent" />
        </PanelResizeHandle>

        <Panel defaultSize={60} minSize={30}>
          <div className="h-full p-2 pl-0">
            <CodeEditorPanel problemId={problem.id} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
