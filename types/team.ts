import { Id } from "@/convex/_generated/dataModel";

export interface TeamMember {
  _id: Id<"users">;
  name: string;
  email: string;
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
}

export interface TeamMemberWithPresence extends TeamMember {
  isCurrentUser?: boolean;
}
