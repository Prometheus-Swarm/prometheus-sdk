// Mock cross-fetch module first (must be hoisted)
jest.mock("cross-fetch");

import fetch from "cross-fetch";
import {
  AuthenticationError,
  PrometheusSwarmSDK,
  ValidationError
} from "../src";

// Cast the mocked fetch
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("PrometheusSwarmSDK", () => {
  let sdk: PrometheusSwarmSDK;

  beforeEach(() => {
    sdk = new PrometheusSwarmSDK({
      apiKey: "test-api-key",
      baseUrl: "https://test.prometheusswarm.ai"
    });
    mockFetch.mockClear();
  });

  describe("Constructor", () => {
    it("should initialize with required config", () => {
      const config = {
        apiKey: "test-key",
        baseUrl: "https://test.com",
        timeout: 5000,
        retryAttempts: 2,
        retryDelay: 500
      };

      const client = new PrometheusSwarmSDK(config);
      const clientConfig = client.getConfig();

      expect(clientConfig.baseUrl).toBe("https://test.com");
      expect(clientConfig.timeout).toBe(5000);
      expect(clientConfig.retryAttempts).toBe(2);
      expect(clientConfig.retryDelay).toBe(500);
      expect(clientConfig.hasApiKey).toBe(true);
    });

    it("should throw error if API key is missing", () => {
      expect(() => {
        new PrometheusSwarmSDK({ apiKey: "" });
      }).toThrow("API key is required");
    });

    it("should use default values for optional config", () => {
      const client = new PrometheusSwarmSDK({ apiKey: "test" });
      const config = client.getConfig();

      expect(config.baseUrl).toBe("https://prometheusswarm.ai");
      expect(config.timeout).toBe(30000);
      expect(config.retryAttempts).toBe(3);
      expect(config.retryDelay).toBe(1000);
    });
  });

  describe("createBounty", () => {
    const validBountyRequest = {
      email: "test@example.com",
      githubUrl: "https://github.com/test/repo",
      description: "Test bounty description",
      bountyAmount: 100,
      swarmType: "find-bugs" as const
    };

    it("should create bounty successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "test-id",
          projectName: "test-project",
          status: "in-progress",
          githubUrl: "https://github.com/test/repo",
          swarmType: "find-bugs",
          bountyAmount: 100,
          createdAt: "2024-01-01T00:00:00Z"
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: {
          get: () => null
        }
      } as any);

      const result = await sdk.createBounty(validBountyRequest);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.prometheusswarm.ai/api/v1/swarm",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key"
          }),
          body: expect.stringContaining("test@example.com")
        })
      );
    });

    it("should validate required fields", async () => {
      await expect(
        sdk.createBounty({
          ...validBountyRequest,
          email: ""
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        sdk.createBounty({
          ...validBountyRequest,
          githubUrl: "invalid-url"
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        sdk.createBounty({
          ...validBountyRequest,
          bountyAmount: 0
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
        headers: {
          get: () => null
        }
      } as any);

      await expect(sdk.createBounty(validBountyRequest)).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe("getUserBounties", () => {
    it("should fetch user bounties", async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0,
        email: "test@example.com"
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: {
          get: () => null
        }
      } as any);

      const result = await sdk.getUserBounties("test@example.com");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.prometheusswarm.ai/api/v1/swarm/user?email=test%40example.com",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key"
          })
        })
      );
    });

    it("should validate email parameter", async () => {
      await expect(sdk.getUserBounties("")).rejects.toThrow(
        "Email is required"
      );
    });
  });

  describe("getBountyDetails", () => {
    it("should fetch bounty details", async () => {
      const mockResponse = {
        success: true,
        data: {
          swarmBountyId: "test-id",
          taskName: "test-task",
          swarmType: "find-bugs",
          nodes: [],
          status: "in-progress",
          githubUsername: "testuser",
          prUrl: "",
          githubProfilePicture: null,
          subTasks: []
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: {
          get: () => null
        }
      } as any);

      const result = await sdk.getBountyDetails("test-id", "find-bugs");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.prometheusswarm.ai/api/v1/swarm/details?id=test-id&swarmType=find-bugs",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key"
          })
        })
      );
    });

    it("should validate required parameters", async () => {
      await expect(sdk.getBountyDetails("", "find-bugs")).rejects.toThrow(
        "Bounty ID is required"
      );

      await expect(sdk.getBountyDetails("test-id", "" as any)).rejects.toThrow(
        "Swarm type is required"
      );
    });
  });
});
