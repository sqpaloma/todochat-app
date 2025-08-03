import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  gradient: string;
  badge?: string;
  indicator?: boolean;
  isCollapsed: boolean;
}

export function NavigationItem({
  name,
  href,
  icon: IconComponent,
  active,
  gradient,
  badge,
  indicator,
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
        <IconComponent
          className={`w-5 h-5 ${
            active ? "text-white" : "text-gray-400"
          } group-hover:scale-110 transition-transform duration-200`}
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
            {indicator && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </>
        )}
        {/* Collapsed indicators */}
        {isCollapsed && badge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {badge}
          </div>
        )}
        {isCollapsed && indicator && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        )}
      </div>
    </Link>
  );
}