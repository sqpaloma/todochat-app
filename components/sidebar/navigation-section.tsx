import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, MessageSquare, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavigationItemProps {
  name: string;
  href: string;
  icon: any;
  active: boolean;
  gradient: string;
  badge?: string;
  isCollapsed: boolean;
}

function NavigationItem({
  name,
  href,
  icon: Icon,
  active,
  gradient,
  badge,
  isCollapsed,
}: NavigationItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center rounded-xl transition-all duration-200 group relative ${
          isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5"
        } ${
          active
            ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
        title={isCollapsed ? name : ""}
      >
        <Icon
          className={`w-5 h-5 ${active ? "text-white" : "text-gray-400"} group-hover:scale-110 transition-transform duration-200`}
        />
        {!isCollapsed && (
          <>
            <span className="font-medium">{name}</span>
            {badge && (
              <span
                className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && badge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {badge}
          </div>
        )}
      </div>
    </Link>
  );
}

interface NavigationSectionProps {
  isCollapsed: boolean;
  teamId?: string;
}

export function NavigationSection({
  isCollapsed,
  teamId = "team-1",
}: NavigationSectionProps) {
  const pathname = usePathname();
  const tasks = useQuery(api.tasks.getTasks, { teamId }) || [];

  const navigationItems = [
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      active: pathname === "/tasks",
      gradient: "from-blue-500 to-cyan-500",
      badge: tasks.length > 0 ? tasks.length.toString() : undefined,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
      active: pathname === "/chat",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      active: pathname === "/team",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <nav className="px-4 space-y-2">
      <div className="mb-4">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </p>
        )}
        {navigationItems.map((item) => (
          <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
        ))}
      </div>
    </nav>
  );
}
