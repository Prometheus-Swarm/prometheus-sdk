import { ValidationError } from './errors';
import { BountyType, CreateBountyRequest, Network, SwarmType } from './types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateGitHubUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'github.com' &&
      urlObj.pathname.split('/').length >= 3 &&
      urlObj.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

export function validateSwarmType(type: string): type is SwarmType {
  return ['document-summarizer', 'find-bugs', 'build-feature'].includes(type);
}

export function validateBountyType(type: string): type is BountyType {
  return ['usdc', 'eth', 'credits', 'koii', 'kpl', 'wkoii'].includes(type);
}

export function validateNetwork(network: string): network is Network {
  return ['mainnet', 'base', 'sepolia'].includes(network);
}

export function validateCreateBountyRequest(request: CreateBountyRequest): void {
  if (!request.email) {
    throw new ValidationError('Email is required', 'email');
  }

  if (!validateEmail(request.email)) {
    throw new ValidationError('Invalid email format', 'email');
  }

  if (!request.githubUrl) {
    throw new ValidationError('GitHub URL is required', 'githubUrl');
  }

  if (!validateGitHubUrl(request.githubUrl)) {
    throw new ValidationError(
      'Invalid GitHub URL. Must be in format: https://github.com/username/repo',
      'githubUrl'
    );
  }

  if (!request.description || request.description.trim().length === 0) {
    throw new ValidationError('Description is required', 'description');
  }

  if (request.description.length > 2000) {
    throw new ValidationError(
      'Description must be less than 2000 characters',
      'description'
    );
  }

  if (!request.bountyAmount || request.bountyAmount <= 0) {
    throw new ValidationError(
      'Bounty amount must be greater than 0',
      'bountyAmount'
    );
  }

  if (!validateSwarmType(request.swarmType)) {
    throw new ValidationError(
      'Invalid swarm type. Must be one of: document-summarizer, find-bugs, build-feature',
      'swarmType'
    );
  }

  if (!validateBountyType(request.bountyType)) {
    throw new ValidationError(
      'Invalid bounty type. Must be one of: usdc, eth, credits, koii, kpl, wkoii',
      'bountyType'
    );
  }

  if (!validateNetwork(request.network)) {
    throw new ValidationError(
      'Invalid network. Must be one of: mainnet, base, sepolia',
      'network'
    );
  }

  if (request.projectName && request.projectName.length > 100) {
    throw new ValidationError(
      'Project name must be less than 100 characters',
      'projectName'
    );
  }

  // Validate transaction details for non-credits bounties
  const isCreditsBounty = request.bountyType === 'credits';
  if (!isCreditsBounty && (!request.account || !request.txHash)) {
    throw new ValidationError(
      'Account and txHash are required for non-credits bounties',
      'transaction'
    );
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatSwarmType(swarmType: SwarmType): string {
  switch (swarmType) {
    case 'document-summarizer':
      return 'Document & Summarize';
    case 'find-bugs':
      return 'Find Bugs';
    case 'build-feature':
      return 'Build a Feature';
    default:
      return swarmType;
  }
} 