export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  imageUrl?: string;
  _creationTime: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
  role?: string;
  joinDate?: number;
  phone?: string;
  location?: string;
  imageUrl?: string;
}
