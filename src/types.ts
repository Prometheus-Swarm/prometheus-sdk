export type SwarmType = "document-summarizer" | "find-bugs" | "build-feature";
export type BountyStatus =
  | "in-progress"
  | "assigned"
  | "auditing"
  | "completed"
  | "failed";

export interface SDKConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface CreateBountyRequest {
  email: string;
  githubUrl: string;
  description: string;
  bountyAmount: number;
  swarmType: SwarmType;
  projectName?: string;
}

export interface CreateBountyPayload {
  values: {
    email: string;
    githubUrl: string;
    description: string;
    bountyAmount: number;
    swarmType: SwarmType;
    projectName?: string;
  };
}

export interface BountyData {
  id: string;
  projectName: string;
  status: BountyStatus;
  githubUrl: string;
  swarmType: SwarmType;
  bountyAmount: number;
  createdAt: string;
  // User credit information for billing
  userCredits: {
    currentCredits: number;
    chargeAmount: number;
    userCreated: boolean;
  };
}

export interface CreateBountyResponse {
  success: boolean;
  data?: BountyData;
  error?: string;
}

export interface UserBounty {
  id: string;
  "github-url": string;
  "bounty-task": string;
  "project-name": string;
  description: string;
  "bounty-amount": number;
  status: BountyStatus;
  assignedNode: any;
  isMyPortal: boolean;
}

export interface GetUserBountiesResponse {
  success: boolean;
  data: UserBounty[];
  count: number;
  email: string;
  error?: string;
}

export interface SubTask {
  swarmBountyId: string;
  taskName: string;
  title: string;
  description: string;
  status: string;
  githubUsername: string;
  prUrl: string;
  subTasks?: any[];
}

export interface DetailedBounty {
  swarmBountyId: string;
  taskName: string;
  swarmType: SwarmType;
  nodes: string[];
  status: BountyStatus;
  githubUsername: string;
  prUrl: string;
  githubProfilePicture: string | null;
  subTasks: SubTask[];
}

export interface GetDetailedBountyResponse {
  success: boolean;
  data?: DetailedBounty;
  error?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}
