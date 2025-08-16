"use client";
import { OutputPanel } from "@/components/molecules/output-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCodeSubmission } from "@/hooks/use-code-submission";
import Editor, { OnChange } from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Zap } from "lucide-react";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const defaultCode = {
  python: `# Your Python code here\n# For this example, stdin will be "World"\n# The expected output is "Hello, World!"\n\nprint("Hello, " + input())`,
  javascript: `// Your JavaScript code here\n// For this example, stdin will be "World"\n// The expected output is "Hello, World!"\n\nconst stdin = process.argv[2];\nconsole.log(\`Hello, \${stdin}!\`);`,
};

export function CodeEditorPanel({ problemId }: { problemId: string }) {
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [code, setCode] = useState<string>(defaultCode.python);
  const { submitCode, result, isLoading, error } = useCodeSubmission();

  const handleLanguageChange = (lang: "python" | "javascript") => {
    setLanguage(lang);
    setCode(defaultCode[lang]);
  };

  const handleCodeChange: OnChange = (value) => {
    setCode(value || "");
  };

  const handleRunCode = () => {
    submitCode({ problemId, code, language });
  };

  return (
    <div className="flex flex-col h-full bg-card/50 border-border rounded-lg overflow-hidden">
      <PanelGroup direction="vertical">
        <Panel defaultSize={65} minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b border-border flex-shrink-0">
              <div>
                <Button
                  variant={language === "python" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange("python")}
                >
                  Python
                </Button>
                <Button
                  variant={language === "javascript" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange("javascript")}
                >
                  JavaScript
                </Button>
              </div>
              <Button
                onClick={handleRunCode}
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-28"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLoading ? "loading" : "ready"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Zap className="animate-spin h-4 w-4" />
                    ) : (
                      <Code className="h-4 w-4" />
                    )}
                    {isLoading ? "Running..." : "Run Code"}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
            <div className="flex-grow">
              <Editor
                path={language}
                defaultLanguage={language}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 15 },
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="h-2 bg-transparent flex items-center justify-center group">
          <div className="w-10 h-1 bg-border rounded-full transition-all group-hover:bg-accent group-data-[resize-handle-state=drag]:bg-accent" />
        </PanelResizeHandle>

        <Panel defaultSize={35} minSize={10}>
          <Tabs defaultValue="output" className="h-full flex flex-col">
            <TabsList className="mx-2 mt-2 self-start">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="testcases" disabled>
                Test Cases
              </TabsTrigger>
            </TabsList>
            <TabsContent value="output" className="flex-grow overflow-y-auto">
              <OutputPanel
                isLoading={isLoading}
                error={error}
                result={result}
              />
            </TabsContent>
            <TabsContent value="testcases">
              {/* We will build this later */}
            </TabsContent>
          </Tabs>
        </Panel>
      </PanelGroup>
    </div>
  );
}
