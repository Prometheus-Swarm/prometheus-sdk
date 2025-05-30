# 🔥 Prometheus Swarm SDK

Official TypeScript/JavaScript SDK for the [Prometheus Swarm](https://prometheusswarm.ai) platform. Create bounties, manage swarm tasks, and interact with the decentralized workforce platform programmatically.

[![npm version](https://badge.fury.io/js/prometheus-swarm-sdk.svg)](https://badge.fury.io/js/prometheus-swarm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install prometheus-swarm-sdk
# or
yarn add prometheus-swarm-sdk
# or
pnpm add prometheus-swarm-sdk
```

### Basic Usage

```typescript
import { PrometheusSwarmSDK } from 'prometheus-swarm-sdk';

// Initialize the SDK
const sdk = new PrometheusSwarmSDK({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://prometheusswarm.ai' // optional, defaults to production
});

// Create a bounty
const bounty = await sdk.createBounty({
  email: 'developer@example.com',
  githubUrl: 'https://github.com/username/repository',
  description: 'Find and fix security vulnerabilities in the authentication system',
  bountyAmount: 50,
  swarmType: 'find-bugs',
  bountyType: 'credits',
  network: 'mainnet'
});

console.log('Bounty created:', bounty.data);
```

## 📖 Documentation

### Configuration

```typescript
interface SDKConfig {
  apiKey: string;           // Required: Your Prometheus API key
  baseUrl?: string;         // Optional: API base URL (default: https://prometheusswarm.ai)
  timeout?: number;         // Optional: Request timeout in ms (default: 30000)
  retryAttempts?: number;   // Optional: Number of retry attempts (default: 3)
  retryDelay?: number;      // Optional: Delay between retries in ms (default: 1000)
}
```

### Methods

#### `createBounty(request: CreateBountyRequest): Promise<CreateBountyResponse>`

Creates a new swarm bounty.

```typescript
const bounty = await sdk.createBounty({
  email: 'user@example.com',
  githubUrl: 'https://github.com/owner/repo',
  description: 'Detailed task description',
  bountyAmount: 100,
  swarmType: 'find-bugs', // 'document-summarizer' | 'find-bugs' | 'build-feature'
  bountyType: 'credits',  // 'usdc' | 'eth' | 'credits' | 'koii' | 'kpl' | 'wkoii'
  network: 'mainnet',     // 'mainnet' | 'base' | 'sepolia'
  projectName: 'My Project', // optional
  
  // Required for non-credits bounties:
  account: '0x1234...', // wallet address
  txHash: '0xabcd...'   // transaction hash
});
```

#### `getUserBounties(email: string): Promise<GetUserBountiesResponse>`

Retrieves all bounties for a specific user.

```typescript
const userBounties = await sdk.getUserBounties('user@example.com');
console.log(`Found ${userBounties.count} bounties:`, userBounties.data);
```

#### `getBountyDetails(id: string, swarmType: SwarmType): Promise<GetDetailedBountyResponse>`

Gets detailed information about a specific bounty.

```typescript
const details = await sdk.getBountyDetails('bounty-id', 'find-bugs');
console.log('Bounty details:', details.data);
```

### Swarm Types

- **`document-summarizer`**: Document analysis and summarization tasks
- **`find-bugs`**: Bug finding and security auditing tasks  
- **`build-feature`**: Feature development and implementation tasks

### Bounty Types

- **`credits`**: Platform credits (no blockchain transaction required)
- **`usdc`**: USDC payments (requires `account` and `txHash`)
- **`eth`**: Ethereum payments (requires `account` and `txHash`)
- **`koii`**: KOII token payments (requires `account` and `txHash`)
- **`kpl`**: KPL token payments (requires `account` and `txHash`)
- **`wkoii`**: Wrapped KOII payments (requires `account` and `txHash`)

### Networks

- **`mainnet`**: Ethereum mainnet
- **`base`**: Base network
- **`sepolia`**: Sepolia testnet

## 🛡️ Error Handling

The SDK provides detailed error types for better error handling:

```typescript
import { 
  PrometheusSDKError,
  PrometheusAPIError, 
  ValidationError,
  RateLimitError,
  AuthenticationError,
  NetworkError 
} from 'prometheus-swarm-sdk';

try {
  const bounty = await sdk.createBounty(bountyRequest);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message, 'Field:', error.field);
  } else if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof PrometheusAPIError) {
    console.error('API error:', error.message, 'Status:', error.status);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## 🔐 Authentication

1. **Get API Key**: Contact the Prometheus team or obtain your API key through the platform dashboard
2. **Set Environment Variable**: Store your API key securely
   ```bash
   export PROMETHEUS_API_KEY="your-api-key-here"
   ```
3. **Initialize SDK**:
   ```typescript
   const sdk = new PrometheusSwarmSDK({
     apiKey: process.env.PROMETHEUS_API_KEY!
   });
   ```

## 🎯 Examples

### Creating a Bug Bounty with Credits

```typescript
const bugBounty = await sdk.createBounty({
  email: 'security@company.com',
  githubUrl: 'https://github.com/company/secure-app',
  description: 'Perform comprehensive security audit of user authentication system',
  bountyAmount: 75,
  swarmType: 'find-bugs',
  bountyType: 'credits',
  network: 'mainnet',
  projectName: 'SecureApp Audit'
});
```

### Creating a Feature Development Bounty with USDC

```typescript
const featureBounty = await sdk.createBounty({
  email: 'product@startup.com',
  githubUrl: 'https://github.com/startup/mobile-app',
  description: 'Implement OAuth 2.0 social login integration with Google and GitHub',
  bountyAmount: 500,
  swarmType: 'build-feature',
  bountyType: 'usdc',
  network: 'mainnet',
  account: '0x742d35Cc6634C0532925a3b8D084c22ef4E7a76f',
  txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  projectName: 'Mobile App v2.0'
});
```

### Monitoring User's Bounties

```typescript
// Get all bounties for a user
const bounties = await sdk.getUserBounties('user@example.com');

for (const bounty of bounties.data) {
  console.log(`Bounty: ${bounty['project-name']}`);
  console.log(`Status: ${bounty.status}`);
  console.log(`Amount: ${bounty['bounty-amount']} ${bounty['bounty-type']}`);
  
  // Get detailed information
  const details = await sdk.getBountyDetails(bounty.id, bounty['bounty-task'] as any);
  console.log(`Assigned to: ${details.data?.githubUsername || 'Unassigned'}`);
  console.log(`Subtasks: ${details.data?.subTasks.length || 0}`);
  console.log('---');
}
```

## 🔧 Rate Limiting

The SDK automatically handles rate limiting with exponential backoff:

- **API Rate Limit**: 10 requests per 15 minutes per API key
- **Automatic Retry**: Up to 3 attempts with increasing delays
- **Custom Configuration**: Adjust retry behavior via SDK config

```typescript
const sdk = new PrometheusSwarmSDK({
  apiKey: 'your-key',
  retryAttempts: 5,    // Increase retry attempts
  retryDelay: 2000,    // Increase initial delay
  timeout: 60000       // Increase timeout
});
```

## 📚 TypeScript Support

The SDK is built with TypeScript and provides full type safety:

```typescript
import type { 
  CreateBountyRequest, 
  BountyData, 
  SwarmType 
} from 'prometheus-swarm-sdk';

// Full IntelliSense and type checking
const createBounty = (data: CreateBountyRequest): Promise<BountyData> => {
  return sdk.createBounty(data).then(response => response.data!);
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Platform**: [https://prometheusswarm.ai](https://prometheusswarm.ai)
- **Documentation**: [API Docs](https://docs.prometheusswarm.ai)
- **Support**: [Discord](https://discord.gg/prometheus) | [GitHub Issues](https://github.com/prometheus-swarm/sdk/issues)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [examples](./examples) directory
2. Review the [API documentation](https://docs.prometheusswarm.ai)
3. Search [existing issues](https://github.com/prometheus-swarm/sdk/issues)
4. Create a [new issue](https://github.com/prometheus-swarm/sdk/issues/new)
5. Join our [Discord community](https://discord.gg/prometheus)

---

Built with ❤️ by the Prometheus team 