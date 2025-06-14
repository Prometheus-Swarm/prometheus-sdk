// Main SDK class
export { PrometheusSwarmSDK } from "./client";

// Types
export type {
  APIResponse,
  BountyData,
  BountyStatus,
  CreateBountyPayload,
  CreateBountyRequest,
  CreateBountyResponse,
  DetailedBounty,
  GetDetailedBountyResponse,
  GetUserBountiesResponse,
  SDKConfig,
  SubTask,
  SwarmType,
  UserBounty
} from "./types";

// Errors
export {
  AuthenticationError,
  NetworkError,
  PrometheusAPIError,
  PrometheusSDKError,
  RateLimitError,
  ValidationError
} from "./errors";

// Utilities
export {
  formatSwarmType,
  validateEmail,
  validateGitHubUrl,
  validateSwarmType
} from "./utils";

// Default export
export { PrometheusSwarmSDK as default } from "./client";
