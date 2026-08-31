import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/components/auth/SupabaseAuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Code, MessageCircle, Download, Image as ImageIcon, FileText, Settings } from "lucide-react";

// Import Codehive components
import CodeEditor from "@/components/codehive/CodeEditor";
import ChatModal from "@/components/codehive/ChatModal";
import CustomInput from "@/components/codehive/CustomInput";
import { defineTheme, monacoThemes } from "@/lib/codehive/defineTheme";
import { downloadCodeAsFile, downloadCodeAsImage } from "@/lib/codehive/downloadCode";

// Languages supported by the code editor
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
];

// Mock socket for initial development - to be replaced with actual WebSocket server
const mockSocket = {
  id: 'mock-socket-id',
  on: (event: string, callback: Function) => {},
  off: (event: string) => {},
  emit: (event: string, data: any) => {
    console.log(`Emitted ${event} with data:`, data);
  }
};

// In a real implementation, this would be your Socket.IO server URL
// const socket = io("http://localhost:3001"); 
const socket = mockSocket as any;

export default function CollaborativeCodingPage() {
  const { user } = useAuth();
  const [code, setCode] = useState<string>("// Start coding here...");
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("monokai");
  const [fontSize, setFontSize] = useState<number>(18);
  const [remoteCursorPosition, setRemoteCursorPosition] = useState<{
    lineNumber: number;
    column: number;
  } | null>(null);
  const [customInput, setCustomInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  useEffect(() => {
    defineTheme(theme as keyof typeof monacoThemes).then(() =>
      console.log(`Theme ${theme} defined`)
    );
  }, [theme]);

  useEffect(() => {
    // In a real implementation, these socket event listeners would be active
    /*
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("code_change", (newCode: string) => {
      setCode(newCode);
    });

    socket.on(
      "cursor_position_change",
      (position: { lineNumber: number; column: number }) => {
        setRemoteCursorPosition(position);
      }
    );

    socket.on("execution_output", (output: string) => {
      setOutput(output);
      setIsExecuting(false);
    });

    return () => {
      socket.off("connect");
      socket.off("code_change");
      socket.off("cursor_position_change");
      socket.off("execution_output");
    };
    */

    // For now, show a message that this is a mock implementation
    setOutput("This is a mock implementation. Socket.IO server is not connected.\n\nTo implement real-time collaboration, you would need to set up a Socket.IO server.");
    
  }, []);

  const handleCodeChange = useCallback(
    (action: string, newCode: string) => {
      if (action === "code") {
        setCode(newCode);
        // In a real implementation, this would send the code to other users
        // socket.emit("code_change", newCode);
      }
    },
    []
  );

  const handleCursorPositionChange = useCallback(
    (position: { lineNumber: number; column: number }) => {
      // In a real implementation, this would send the cursor position to other users
      // socket.emit("cursor_position_change", position);
    },
    []
  );

  const handleExecuteCode = () => {
    setIsExecuting(true);
    setOutput("Executing...");
    
    // Mock execution - simulate a delay and then show a result
    setTimeout(() => {
      let result = "";
      
      try {
        // For JavaScript, we can safely eval in this example (but avoid in production!)
        if (language === "javascript") {
          // Capture console.log output
          const originalLog = console.log;
          let logOutput = "";
          
          console.log = function(...args) {
            logOutput += args.join(" ") + "\n";
            originalLog.apply(console, args);
          };
          
          // Add the custom input as a variable
          const input = customInput;
          
          // Try to evaluate the code
          try {
            eval(code);
            result = logOutput || "Code executed successfully. No output.";
          } catch (error: any) {
            result = "Error: " + error.message;
          }
          
          // Restore console.log
          console.log = originalLog;
        } else {
          result = `Code execution for ${language} requires a backend server.\n\nThis is just a demonstration of the UI.`;
        }
      } catch (error: any) {
        result = "Execution error: " + error.message;
      }
      
      setOutput(result);
      setIsExecuting(false);
    }, 1500);
    
    // In a real implementation, this would send the code to a server for execution
    // socket.emit("execute_code", { code, language, customInput });
  };

  const handleDownloadFile = () => {
    downloadCodeAsFile(code, language);
  };

  const handleDownloadImage = () => {
    downloadCodeAsImage(code, `codehive-${Date.now()}.png`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Code className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Collaborative Coding
          </h1>
          <p className="text-muted-foreground">
            Real-time code editing and collaboration
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Settings:</span>
          </div>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={theme}
            onValueChange={(value) => setTheme(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(monacoThemes).map((thm) => (
                <SelectItem key={thm} value={thm}>
                  {monacoThemes[thm as keyof typeof monacoThemes]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Label htmlFor="font-size">Font Size:</Label>
            <Slider
              id="font-size"
              min={12}
              max={24}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              className="w-[120px]"
            />
            <span className="text-sm text-muted-foreground">
              {fontSize}px
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CodeEditor
              code={code}
              onCodeChange={handleCodeChange}
              onCursorPositionChange={handleCursorPositionChange}
              fontSize={fontSize}
              language={language}
              theme={theme}
              remoteCursorPosition={remoteCursorPosition}
            />
          </div>
          <div className="flex flex-col space-y-6">
            <Card className="p-4 flex-1">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" /> Custom Input
              </h3>
              <CustomInput
                customInput={customInput}
                setCustomInput={setCustomInput}
              />
            </Card>

            <Card className="p-4 flex-1">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Code className="h-5 w-5" /> Output
              </h3>
              <div className="bg-muted p-3 rounded-md min-h-[150px] overflow-auto text-sm text-foreground">
                {isExecuting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Executing code...</span>
                  </div>
                ) : (
                  <pre>{output}</pre>
                )}
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleExecuteCode}
                disabled={isExecuting}
                className="flex-1 gap-2"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" />
                    Execute Code
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadFile}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Download File
              </Button>
              <Button
                onClick={handleDownloadImage}
                className="flex-1 gap-2"
                variant="outline"
              >
                <ImageIcon className="h-4 w-4" />
                Download Image
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {user && (
        <ChatModal
          socket={socket}
          userName={user.user_metadata?.full_name || user.email || "Anonymous"}
        />
      )}
    </div>
  );
}