#!/usr/bin/env node

/**
 * Basic usage example for Prometheus Swarm SDK
 *
 * This example demonstrates:
 * - Creating different types of bounties
 * - Fetching user bounties
 * - Getting bounty details
 * - Error handling
 */

const { PrometheusSwarmSDK } = require("prometheus-swarm-sdk");

// Initialize SDK
const sdk = new PrometheusSwarmSDK({
  apiKey: process.env.PROMETHEUS_API_KEY || "your-api-key-here",
  baseUrl: "https://prometheusswarm.ai"
});

async function main() {
  try {
    console.log("🔥 Prometheus Swarm SDK Example\n");

    // Example 1: Create a credits-based bug bounty
    console.log("📝 Creating a bug bounty with credits...");
    const bugBounty = await sdk.createBounty({
      email: "developer@example.com",
      githubUrl: "https://github.com/example/secure-app",
      description:
        "Find security vulnerabilities in the authentication system. Focus on SQL injection, XSS, and authentication bypass vulnerabilities.",
      bountyAmount: 50,
      swarmType: "find-bugs",
      bountyType: "credits",
      network: "mainnet",
      projectName: "SecureApp Security Audit"
    });

    if (bugBounty.success) {
      console.log("✅ Bug bounty created successfully!");
      console.log(`   Bounty ID: ${bugBounty.data.id}`);
      console.log(`   Project: ${bugBounty.data.projectName}`);
      console.log(`   Status: ${bugBounty.data.status}\n`);
    }

    // Example 2: Get user bounties
    console.log("📋 Fetching user bounties...");
    const userBounties = await sdk.getUserBounties("developer@example.com");

    if (userBounties.success) {
      console.log(`✅ Found ${userBounties.count} bounties for user`);

      userBounties.data.forEach((bounty, index) => {
        console.log(`   ${index + 1}. ${bounty["project-name"]}`);
        console.log(`      Status: ${bounty.status}`);
        console.log(
          `      Amount: ${bounty["bounty-amount"]} ${bounty["bounty-type"]}`
        );
        console.log(`      GitHub: ${bounty["github-url"]}`);
      });
      console.log();
    }

    // Example 4: Get detailed bounty information
    if (userBounties.data.length > 0) {
      const firstBounty = userBounties.data[0];
      console.log("🔍 Getting detailed bounty information...");

      const details = await sdk.getBountyDetails(
        firstBounty.id,
        firstBounty["bounty-task"]
      );

      if (details.success && details.data) {
        console.log("✅ Bounty details retrieved:");
        console.log(`   Task: ${details.data.taskName}`);
        console.log(`   Type: ${details.data.swarmType}`);
        console.log(
          `   Assigned to: ${details.data.githubUsername || "Unassigned"}`
        );
        console.log(`   Subtasks: ${details.data.subTasks.length}`);

        if (details.data.subTasks.length > 0) {
          console.log("   Subtask details:");
          details.data.subTasks.forEach((task, index) => {
            console.log(`     ${index + 1}. ${task.title} - ${task.status}`);
          });
        }
      }
    }

    console.log("\n🎉 Example completed successfully!");
  } catch (error) {
    console.error("❌ Error occurred:", error.message);

    // Handle specific error types
    if (error.constructor.name === "ValidationError") {
      console.error("   Field:", error.field);
    } else if (error.constructor.name === "AuthenticationError") {
      console.error("   Check your API key");
    } else if (error.constructor.name === "RateLimitError") {
      console.error(
        "   Rate limit exceeded. Try again in:",
        error.retryAfter,
        "seconds"
      );
    }
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
