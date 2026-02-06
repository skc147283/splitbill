import Anthropic from "@anthropic-ai/sdk";
import { spawn } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

const client = new Anthropic();

// Tool implementations
function runTests(mode: string = "headless", project?: string) {
  return new Promise((resolve, reject) => {
    let command = "npm run test";
    
    if (mode === "headed") {
      command = "npm run test:headed";
    } else if (mode === "debug") {
      command = "npm run test:debug";
    }
    
    if (project) {
      command += ` --project=${project}`;
    }

    const proc = spawn("sh", ["-c", command], {
      cwd: join(process.cwd(), "playwright-tests"),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout?.on("data", (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    proc.stderr?.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(`Tests completed successfully in ${mode} mode`);
      } else {
        reject(`Tests failed with exit code ${code}\n${stderr}`);
      }
    });
  });
}

function getTestReport() {
  try {
    const reportPath = join(
      process.cwd(),
      "playwright-tests/reports/test-results.json"
    );
    const report = JSON.parse(readFileSync(reportPath, "utf-8"));
    return report;
  } catch (error) {
    return { error: "No test report found. Run tests first." };
  }
}

function listTests() {
  try {
    const testsDir = join(process.cwd(), "playwright-tests/tests");
    const fs = require("fs");
    const files = fs.readdirSync(testsDir).filter((f: string) => f.endsWith(".spec.ts"));
    
    const tests = files.map((file: string) => {
      const content = readFileSync(join(testsDir, file), "utf-8");
      const matches = content.match(/test\(\s*'(\[.*?\].*?)'/g) || [];
      return {
        file,
        testCount: matches.length,
        tests: matches.map(m => m.replace(/test\(\s*'|'$/g, '')),
      };
    });

    return tests;
  } catch (error) {
    return { error: "Could not list tests" };
  }
}

function getTestMetrics() {
  const report = getTestReport();
  
  if (report.error) return report;

  const totalTests = report.stats?.expected || 0;
  const passedTests = report.stats?.expected - (report.stats?.unexpected || 0) || 0;
  const failedTests = report.stats?.unexpected || 0;
  const duration = report.stats?.duration || 0;

  return {
    totalTests,
    passedTests,
    failedTests,
    successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) + "%" : "0%",
    durationMs: duration,
    timestamp: new Date().toISOString(),
  };
}

async function processToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
) {
  switch (toolName) {
    case "run_ui_tests":
      return await runTests(toolInput.mode as string, toolInput.project as string);
    case "get_test_report":
      return getTestReport();
    case "list_tests":
      return listTests();
    case "get_test_metrics":
      return getTestMetrics();
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function main() {
  const tools = [
    {
      name: "run_ui_tests",
      description: "Run Playwright UI tests for SplitBill application",
      input_schema: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: ["headless", "headed", "debug"],
            description:
              "Test execution mode - headless (no visual output), headed (shows browser), or debug (interactive)",
          },
          project: {
            type: "string",
            enum: ["chromium", "firefox", "webkit", "Mobile Chrome"],
            description: "Browser project to test against",
          },
        },
        required: ["mode"],
      },
    },
    {
      name: "get_test_report",
      description: "Get the latest test report with detailed results",
      input_schema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "list_tests",
      description: "List all available test cases",
      input_schema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_test_metrics",
      description: "Get test execution metrics and statistics",
      input_schema: {
        type: "object",
        properties: {},
      },
    },
  ];

  const systemPrompt = `You are a helpful test automation assistant for the SplitBill application. 
You have access to tools for running Playwright UI tests, viewing test reports, and getting test metrics.

Help users with:
- Running UI tests in different modes (headless, headed, debug)
- Testing across different browsers (chromium, firefox, webkit, mobile)
- Analyzing test results and metrics
- Listing available tests
- Providing insights about test coverage and failures

When running tests, explain what will happen and ask for confirmation if needed.
Always provide clear summaries of test results.`;

  const messages: Array<{
    role: "user" | "assistant";
    content: any;
  }> = [];

  // Example conversation - in real usage this would be interactive
  const userMessage =
    "Run the UI tests in headed mode to verify the application is working correctly.";

  console.log(`User: ${userMessage}\n`);
  messages.push({ role: "user", content: userMessage });

  // Agentic loop
  while (true) {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      tools: tools as any,
      messages: messages,
    });

    // Process response
    let hasToolUse = false;
    const toolResults = [];

    for (const block of response.content) {
      if (block.type === "text") {
        console.log(`Assistant: ${block.text}\n`);
      } else if (block.type === "tool_use") {
        hasToolUse = true;
        console.log(`Calling tool: ${block.name}`);
        console.log(`Input: ${JSON.stringify(block.input, null, 2)}\n`);

        try {
          const result = await processToolCall(
            block.name,
            block.input as Record<string, unknown>
          );
          console.log(`Tool result: ${JSON.stringify(result, null, 2)}\n`);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        } catch (error) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Error: ${error instanceof Error ? error.message : String(error)}`,
            is_error: true,
          });
        }
      }
    }

    // Add assistant response to messages
    messages.push({ role: "assistant", content: response.content });

    // If there were tool calls, add results and continue
    if (hasToolUse) {
      messages.push({ role: "user", content: toolResults as any });

      // Check stop reason
      if (response.stop_reason === "end_turn") {
        break;
      }
    } else {
      // No more tool calls, conversation ended
      break;
    }
  }

  console.log("\n=== Test Automation Session Complete ===");
}

main().catch(console.error);
