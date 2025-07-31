"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";
import { ChatTab } from "@/types/chat";

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  activeTab: ChatTab;
  selectedDirectContact: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formatFileSize: (bytes: number) => string;
  onCancelFile: () => void;
}

export function ChatInput({
  newMessage,
  onMessageChange,
  onSendMessage,
  onFileSelect,
  onFileUpload,
  selectedFile,
  isUploading,
  activeTab,
  selectedDirectContact,
  fileInputRef,
  formatFileSize,
  onCancelFile,
}: ChatInputProps) {
  const getPlaceholder = () => {
    return selectedDirectContact
      ? `Type a message to ${selectedDirectContact}...`
      : "Type a message for the team...";
  };

  const isInputDisabled =
    selectedFile !== null || (activeTab === "direct" && !selectedDirectContact);

  return (
    <div className="bg-white border-t border-purple-200 p-4">
      <form onSubmit={onSendMessage} className="flex items-end space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileSelect}
          className="hidden"
          accept="*/*"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg flex-shrink-0"
          disabled={isInputDisabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="pr-12 py-3 rounded-xl border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white text-sm"
            disabled={isInputDisabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:bg-purple-100 rounded-lg"
            disabled={activeTab === "direct" && !selectedDirectContact}
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        <Button
          type="submit"
          disabled={!newMessage.trim() || isInputDisabled}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:bg-gray-400 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>

      {/* File Preview */}
      {selectedFile && (
        <div className="bg-purple-50 border-t border-purple-200 px-4 py-3 mt-3">
          <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Paperclip className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelFile}
                disabled={isUploading}
                className="px-3 py-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onFileUpload}
                disabled={isUploading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3 py-1 text-xs"
              >
                {isUploading ? "Uploading..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
