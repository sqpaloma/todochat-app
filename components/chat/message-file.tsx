"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Video, Music } from "lucide-react";

interface MessageFileProps {
  fileId?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number;
  fileUrl?: string | null;
}

export function MessageFile({
  fileId,
  fileName,
  fileType,
  fileSize,
  fileUrl,
}: MessageFileProps) {
  if (!fileId || !fileUrl) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType?: string | null) => {
    if (!fileType) return <FileText className="w-5 h-5" />;

    if (fileType.startsWith("image/")) return <Image className="w-5 h-5" />;
    if (fileType.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (fileType.startsWith("audio/")) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const handleFileDownload = () => {
    if (fileUrl && fileName) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImageFile = fileType?.startsWith("image/") || false;

  if (isImageFile) {
    return (
      <div className="mt-2">
        <img
          src={fileUrl || undefined}
          alt={fileName || "Image"}
          className="max-w-sm max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => {
            if (fileUrl) {
              window.open(fileUrl, "_blank", "noopener,noreferrer");
            }
          }}
        />
        {fileName && (
          <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 bg-muted rounded-lg p-3 border border-border max-w-sm">
      <div className="flex items-center space-x-3">
        <div className="text-primary">{getFileIcon(fileType)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {fileName}
          </p>
          {fileSize && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileDownload}
          className="p-1 text-primary hover:bg-primary/10 rounded"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
