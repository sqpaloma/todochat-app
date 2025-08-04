"use client";

import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { useState } from "react";

interface Reaction {
  emoji: string;
  users: Array<{ userId: string; userName: string }>;
}

interface MessageReactionsProps {
  reactions?: Reaction[];
  onReaction: (emoji: string) => void;
  position: "left" | "right";
  showNudge?: boolean;
  onNudge?: () => void;
  isNudging?: boolean;
  onCreateTask?: () => void;
}

export function MessageReactions({
  reactions,
  onReaction,
  position,
  showNudge = false,
  onNudge,
  isNudging = false,
  onCreateTask,
}: MessageReactionsProps) {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (emoji: string) => {
    onReaction(emoji);
    setShowReactions(false);
  };

  const positionClasses =
    position === "left"
      ? "absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-3"
      : "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-3";

  const popupPosition =
    position === "left"
      ? "absolute top-full right-0 mt-2"
      : "absolute top-full left-0 mt-2";

  return (
    <div
      className={`${positionClasses} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
    >
      <div className="flex items-center space-x-2 bg-background rounded-xl shadow-lg border border-border px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReactions(!showReactions)}
          className="p-2 h-auto hover:bg-muted rounded-lg"
        >
          <Smile className="w-4 h-4 text-muted-foreground" />
        </Button>

        {onCreateTask && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateTask}
            className="p-2 h-auto hover:bg-muted rounded-lg"
          >
            <span className="text-muted-foreground">Task</span>
          </Button>
        )}

        {showNudge && onNudge && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNudge}
            className="p-2 h-auto hover:bg-muted rounded-lg"
            title="Nudge user"
            disabled={isNudging}
          >
            <span
              className={`w-4 h-4 ${isNudging ? "text-muted-foreground" : "text-primary"}`}
            >
              ⚡
            </span>
          </Button>
        )}
      </div>

      {/* Quick reaction popup */}
      {showReactions && (
        <div
          className={`${popupPosition} bg-background rounded-xl shadow-lg border border-border px-3 py-2 flex space-x-2`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("👍")}
            className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
            aria-label="React with thumbs up"
          >
            👍
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("❤️")}
            className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
            aria-label="React with heart"
          >
            ❤️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("😂")}
            className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
            aria-label="React with laughing face"
          >
            😂
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("😮")}
            className="p-2 h-auto hover:bg-muted rounded-lg text-lg"
            aria-label="React with surprised face"
          >
            😮
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReactionDisplay({
  reactions,
  onReaction,
}: {
  reactions?: Reaction[];
  onReaction: (emoji: string) => void;
}) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 mt-2">
      {reactions.map((reaction) => (
        <div
          key={`reaction-${reaction.emoji}`}
          className="bg-muted rounded-full px-3 py-2 text-xs flex items-center space-x-2 shadow-sm border border-border cursor-pointer hover:bg-muted/80"
          onClick={() => onReaction(reaction.emoji)}
          role="button"
          tabIndex={0}
          aria-label={`${reaction.emoji} reaction by ${reaction.users.length} user${reaction.users.length !== 1 ? "s" : ""}`}
        >
          <span className="text-base">{reaction.emoji}</span>
          <span className="text-primary font-semibold">
            {reaction.users.length}
          </span>
        </div>
      ))}
    </div>
  );
}
