import { Plus, Send, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberActionsMenuProps {
  memberName: string;
  onAction: (action: string, memberName: string) => void;
}

const actions = [
  { key: "Add Task", label: "Add Task", icon: Plus },
  { key: "Send Message", label: "Send Message", icon: Send },
  { key: "Edit", label: "Edit", icon: Edit },
];

export function MemberActionsMenu({ memberName, onAction }: MemberActionsMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      {actions.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          onClick={() => onAction(key, memberName)}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}