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
  email: 'user@example.com',
  githubUrl: 'https://github.com/owner/repo',
  description: 'Detailed task description',
  bountyAmount: 100,
  swarmType: 'find-bugs', // 'document-summarizer' | 'find-bugs' | 'build-feature'
  projectName: 'My Project' // optional
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
  projectName: 'My Project' // optional
});
```

#### `getUserBounties(email: string): Promise<GetUserBountiesResponse>`

Retrieves all bounties for a specific user.

```typescript
const userBounties = await sdk.getUserBounties('user@example.com');
console.log(`Found ${userBounties.count} bounties:`, userBounties.data);
```

#### `getBountyDetails(id: string): Promise<GetDetailedBountyResponse>`

Gets detailed information about a specific bounty.

```typescript
const details = await sdk.getBountyDetails('bounty-id');
console.log('Bounty details:', details.data);
```

### Swarm Types

- **`document-summarizer`**: Document analysis and summarization tasks
- **`find-bugs`**: Bug finding and security auditing tasks  
- **`build-feature`**: Feature development and implementation tasks

### Payment Method

All bounties are paid using **platform credits**. Credits are automatically deducted from your account balance when creating a bounty.

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

### Creating a Bug Bounty

```typescript
const bugBounty = await sdk.createBounty({
  email: 'security@company.com',
  githubUrl: 'https://github.com/company/secure-app',
  description: 'Perform comprehensive security audit of user authentication system. Focus on SQL injection, XSS, and authentication bypass vulnerabilities.',
  bountyAmount: 75,
  swarmType: 'find-bugs',
  projectName: 'SecureApp Audit'
});

if (bugBounty.success) {
  console.log('Bug bounty created successfully!');
  console.log('Bounty ID:', bugBounty.data.id);
  console.log('Status:', bugBounty.data.status);
}
```

### Creating a Feature Development Bounty

```typescript
const featureBounty = await sdk.createBounty({
  email: 'product@startup.com',
  githubUrl: 'https://github.com/startup/mobile-app',
  description: 'Implement OAuth 2.0 social login integration with Google, GitHub, and Discord. Include proper error handling and user session management.',
  bountyAmount: 200,
  swarmType: 'build-feature',
  projectName: 'Mobile App Social Login'
});

if (featureBounty.success) {
  console.log('Feature bounty created successfully!');
  console.log('Project:', featureBounty.data.projectName);
  console.log('Amount:', featureBounty.data.bountyAmount, 'credits');
}
```

### Creating a Documentation Bounty

```typescript
const docBounty = await sdk.createBounty({
  email: 'docs@company.com',
  githubUrl: 'https://github.com/company/api-docs',
  description: 'Create comprehensive API documentation with code examples, authentication guides, and troubleshooting sections.',
  bountyAmount: 50,
  swarmType: 'document-summarizer',
  projectName: 'API Documentation'
});
```

### Monitoring User's Bounties

```typescript
// Get all bounties for a user
const bounties = await sdk.getUserBounties('user@example.com');

for (const bounty of bounties.data) {
  console.log(`Bounty: ${bounty['project-name']}`);
  console.log(`Status: ${bounty.status}`);
  console.log(`Amount: ${bounty['bounty-amount']} credits`);
  
  // Get detailed information
  const details = await sdk.getBountyDetails(bounty.id);
  if (details.success && details.data) {
    console.log(`Assigned to: ${details.data.githubUsername || 'Unassigned'}`);
    console.log(`Subtasks: ${details.data.subTasks.length || 0}`);
  }
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

## 💰 Credits Management

### How Credits Work

- **Automatic Deduction**: Credits are automatically deducted when creating bounties
- **Insufficient Credits**: API will return an error if you don't have enough credits
- **Credit Balance**: Contact support to check your current credit balance
- **Purchasing Credits**: Reach out to the Prometheus team to purchase additional credits

### Credit Usage Examples

```typescript
try {
  // This will deduct 100 credits from your account
  const bounty = await sdk.createBounty({
    email: 'user@example.com',
    githubUrl: 'https://github.com/user/repo',
    description: 'High-value feature development',
    bountyAmount: 100,
    swarmType: 'build-feature'
  });
} catch (error) {
  if (error.message.includes('Credits validation failed')) {
    console.error('Insufficient credits! Please contact support to purchase more.');
  }
}
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

## 💡 Need More Credits?

Contact the Prometheus team to:
- Check your current credit balance
- Purchase additional credits
- Set up auto-renewal for your account
- Discuss enterprise credit packages

---

Built with ❤️ by the Prometheus team 