export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  status: "online" | "offline";
  role: string;
  joinDate: number;
  imageUrl?: string;
  phone?: string;
  location?: string;
}

export interface TeamStats {
  total: number;
  online: number;
  offline: number;
  onlinePercentage: number;
}

export interface TeamFilters {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
}

export interface TeamMemberWithPresence extends TeamMember {
  isCurrentUser?: boolean;
}

export type TeamMemberStatus = "online" | "offline";
export type TeamMemberRole = "admin" | "member" | "moderator" | "viewer";
