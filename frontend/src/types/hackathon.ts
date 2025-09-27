export interface Hackathon {
  _id: string;
  title: string;
  description: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  winnerAnnouncementDate?: string;
  isActive: boolean;
  problemStatements: string[];
  maxTeamSize: number;
  venue?: string;
  mode: 'online' | 'offline' | 'hybrid';
  registrationFee: number;
  prizes: Prize[];
  tags: string[];
  totalMembersJoined: number;
  maxRegistrations: number;
  requirements: string[];
  rules: string[];
  bannerImage?: string;
  evaluationCriteria?: EvaluationCriterion[];
  submissionDeadline?: string;
  submissionFormat?: string;
  organizer?: Organizer;
  faqs?: FAQ[];
  socialLinks?: SocialLinks;
  status: HackathonStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  position: string;
  amount: number;
  description?: string;
}

export interface EvaluationCriterion {
  criterion: string;
  weight: number;
}

export interface Organizer {
  name?: string;
  contactEmail?: string;
  contactNumber?: string;
  organization?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  discord?: string;
}

export type HackathonStatus = 
  | 'upcoming'
  | 'registration_open'
  | 'registration_closed'
  | 'ongoing'
  | 'winner_to_announced'
  | 'completed'
  | 'cancelled';

export interface HackathonFilters {
  page?: number;
  limit?: number;
  status?: string;
  mode?: string;
  tags?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface HackathonResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  data: Hackathon[];
}

export interface HackathonFormData extends Omit<Hackathon, 'registrationDeadline' | 'startDate' | 'endDate' | 'winnerAnnouncementDate' | 'submissionDeadline'> {
  registrationDeadline: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  winnerAnnouncementDate?: Date | null;
  submissionDeadline?: Date | null;
}


export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
  email?: string;
  skills?: string[];
  experience?: string;
}

export interface Message {
  id: string;
  teamId: string;
  senderId: string;
  text: string;
  messageType?: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
  createdAt?: string;
  isOptimistic?: boolean;
}

export interface TeamData {
  members: TeamMember[];
  currentUser: string;
}

