export type SwarmType = "document-summarizer" | "find-bugs" | "build-feature";
export type BountyType = "usdc" | "eth" | "credits" | "koii" | "kpl" | "wkoii";
export type Network = "mainnet" | "base" | "sepolia";
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
  isAutoIntegrationKit?: boolean;
}

export interface CreateBountyPayload {
  values: {
    email: string;
    githubUrl: string;
    description: string;
    bountyAmount: number;
    swarmType: SwarmType;
    bountyType: "credits";
    projectName?: string;
    isAutoIntegrationKit?: boolean;
  };
}

export interface BountyData {
  id: string;
  projectName: string;
  status: BountyStatus;
  githubUrl: string;
  swarmType: SwarmType;
  bountyAmount: number;
  bountyType: BountyType;
  createdAt: string;
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
  "bounty-type": string;
  "transaction-hash": string;
  status: BountyStatus;
  network: Network;
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
