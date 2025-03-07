import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateUploadProgress();
      onFileSelect(file);
    }
  };

  const simulateUploadProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      {!selectedFile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <span className="text-sm truncate max-w-[100px]">
            {selectedFile.name}
          </span>
          <Progress value={progress} className="w-[60px]" />
          <Button variant="ghost" size="icon" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}