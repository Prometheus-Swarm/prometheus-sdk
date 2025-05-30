import fetch from 'cross-fetch';
import {
    AuthenticationError,
    NetworkError,
    PrometheusAPIError,
    PrometheusSDKError,
    RateLimitError
} from './errors';
import {
    CreateBountyPayload,
    CreateBountyRequest,
    CreateBountyResponse,
    GetDetailedBountyResponse,
    GetUserBountiesResponse,
    SDKConfig,
    SwarmType
} from './types';
import { sleep, validateCreateBountyRequest } from './utils';

export class PrometheusSwarmSDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(config: SDKConfig) {
    if (!config.apiKey) {
      throw new PrometheusSDKError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://prometheusswarm.ai';
    this.timeout = config.timeout || 30000;
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    // Add timeout support
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    requestOptions.signal = controller.signal;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);
        
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new AuthenticationError(data.error || 'Unauthorized');
          }
          
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '900');
            if (attempt < this.retryAttempts) {
              await sleep(this.retryDelay * attempt);
              continue;
            }
            throw new RateLimitError(data.error, retryAfter);
          }

          throw new PrometheusAPIError(
            data.error || `HTTP ${response.status}`,
            response.status,
            data
          );
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof PrometheusAPIError) {
          throw error;
        }

        if (attempt === this.retryAttempts) {
          if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new NetworkError('Network request failed', error as Error);
          }
          throw new NetworkError(`Request failed after ${this.retryAttempts} attempts`, error as Error);
        }

        await sleep(this.retryDelay * attempt);
      }
    }

    throw new NetworkError('Maximum retry attempts exceeded');
  }

  /**
   * Create a new swarm bounty
   * @param request - Bounty creation parameters
   * @returns Promise resolving to the created bounty data
   */
  async createBounty(request: CreateBountyRequest): Promise<CreateBountyResponse> {
    // Validate input
    validateCreateBountyRequest(request);

    const isCreditsBounty = request.bountyType === 'credits';

    const payload: CreateBountyPayload = {
      values: {
        email: request.email,
        githubUrl: request.githubUrl,
        description: request.description,
        bountyAmount: request.bountyAmount,
        swarmType: request.swarmType,
        bountyType: request.bountyType,
        network: request.network,
        projectName: request.projectName,
        isAutoIntegrationKit: request.isAutoIntegrationKit || false,
      },
      account: request.account,
      txHash: request.txHash,
      isCreditsBounty,
    };

    return this.makeRequest<CreateBountyResponse>('/api/v1/swarm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get all bounties for a specific user email
   * @param email - User's email address
   * @returns Promise resolving to user's bounties
   */
  async getUserBounties(email: string): Promise<GetUserBountiesResponse> {
    if (!email) {
      throw new PrometheusSDKError('Email is required');
    }

    const params = new URLSearchParams({ email });
    return this.makeRequest<GetUserBountiesResponse>(`/api/v1/swarm/user?${params}`);
  }

  /**
   * Get detailed information about a specific bounty
   * @param id - Bounty ID
   * @param swarmType - Type of swarm task
   * @returns Promise resolving to detailed bounty information
   */
  async getBountyDetails(id: string, swarmType: SwarmType): Promise<GetDetailedBountyResponse> {
    if (!id) {
      throw new PrometheusSDKError('Bounty ID is required');
    }
    if (!swarmType) {
      throw new PrometheusSDKError('Swarm type is required');
    }

    const params = new URLSearchParams({ id, swarmType });
    return this.makeRequest<GetDetailedBountyResponse>(`/api/v1/swarm/details?${params}`);
  }

  /**
   * Get SDK configuration (without exposing API key)
   */
  getConfig(): Omit<SDKConfig, 'apiKey'> & { hasApiKey: boolean } {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      hasApiKey: !!this.apiKey,
    };
  }
} 