// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
// import { z } from "zod";
// import fetch from "node-fetch";
// import { createServer, IncomingMessage, ServerResponse } from 'http';
// import { readFile } from 'fs/promises';
// import { join } from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const PORT = process.env.PORT || 4000;
// // Create MCP server
// const server = new McpServer({
//   name: "capmeet-recordings",
//   version: "1.0.0",
//   capabilities: { tools: {}, resources: {} },
// });
// // Register a tool with proper input validation
// server.tool(
//   "getMyRecordings",
//   {
//     input: z.object({ userId: z.string() }),
//   },
//   async ({ input }) => {
//     console.log('getMyRecordings called with input:', input);
//     try {
//       const url = `https://api.capmeet.ai/recordings/my-recordings`;
//       console.log('Making request to:', url);
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNyaW1hcmFuNzEyQGdtYWlsLmNvbSIsInN1YiI6NCwiaWF0IjoxNzYwNjc3NjM1LCJleHAiOjE3NjMyNjk2MzV9.tqjwHaIg4U3lfMOn_vdtGwUEu6icuV22KIs1JPZ4DFc`,
//         },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error Response:', {
//           status: response.status,
//           statusText: response.statusText,
//           headers: Object.fromEntries(response.headers.entries()),
//           body: errorText
//         });
//         throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
//       }
//       const data = await response.json();
//       console.log('API Response:', JSON.stringify(data, null, 2));
//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify({
//               status: 'success',
//               data: data,
//               timestamp: new Date().toISOString()
//             }, null, 2),
//           },
//         ],
//       };
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       console.error("Error in getMyRecordings:", {
//         error: errorMessage,
//         stack: err instanceof Error ? err.stack : undefined,
//         input: input
//       });
//       return {
//         content: [{ 
//           type: "text", 
//           text: JSON.stringify({
//             status: 'error',
//             message: 'Error fetching recordings',
//             error: errorMessage,
//             timestamp: new Date().toISOString()
//           }, null, 2)
//         }],
//       };
//     }
//   }
// );
// // Create HTTP server
// const httpServer = createServer(async (req, res) => {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.writeHead(200);
//     res.end();
//     return;
//   }
//   // Serve static files
//   if (req.method === 'GET' && req.url === '/') {
//     try {
//       const filePath = join(process.cwd(), 'public/index.html');
//       const content = await readFile(filePath, 'utf-8');
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.end(content);
//       return;
//     } catch (error) {
//       console.error('Error serving file:', error);
//       res.statusCode = 500;
//       res.end('Error loading page');
//       return;
//     }
//   }
//   // Handle API requests
//   if (req.method === 'POST') {
//     let body = '';
//     req.on('data', chunk => {
//       body += chunk.toString();
//     });
//     req.on('end', () => {
//       try {
//         const parsedBody = body ? JSON.parse(body) : {};
//         // Clone the request and response objects to pass to the transport
//         const reqClone = Object.assign({}, req, { body: parsedBody });
//         const resClone = Object.assign({}, res, {
//           setHeader: (key: string, value: string) => res.setHeader(key, value),
//           write: (data: any) => res.write(data),
//           end: () => res.end()
//         });
//         transport.handleRequest(reqClone as any, res as any, parsedBody).catch((error: Error) => {
//           console.error('Error handling request:', error);
//           res.statusCode = 500;
//           res.end(JSON.stringify({
//             jsonrpc: '2.0',
//             error: { code: -32603, message: 'Internal error' },
//             id: null
//           }));
//         });
//       } catch (error) {
//         console.error('Error parsing request:', error);
//         res.statusCode = 400;
//         res.end(JSON.stringify({
//           jsonrpc: '2.0',
//           error: { code: -32700, message: 'Parse error' },
//           id: null
//         }));
//       }
//     });
//   } else {
//     res.statusCode = 404;
//     res.end('Not Found');
//   }
// });
// // Create transport with only valid options
// const transport = new StreamableHTTPServerTransport({
//   sessionIdGenerator: () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
// });
// // Connect MCP server to transport
// server.connect(transport).then(() => {
//   // Start the server
//   httpServer.listen(PORT, () => {
//     console.log(`✅ MCP Server running on http://localhost:${PORT}`);
//     console.log(`📄 Test page: http://localhost:${PORT}`);
//   });
// });
import express from 'express';
// 1. IMPORT THE CORRECT EXPRESS ADAPTER
// The SDK's 'server/express.js' export provides the utility to integrate with Express.
import { createExpressMcpRouter } from "@modelcontextprotocol/sdk/server/express.js";
// 1. Define your custom tool logic
class CustomTools {
    async search({ query }) {
        // Your logic to search your data source (e.g., database, external API)
        console.log(`Searching for: ${query}`);
        return [{ id: 'doc-1', title: 'Example Document', snippet: 'A brief summary of the search result.' }];
    }
    async fetch({ document_id }) {
        // Your logic to fetch the full content of a document by ID
        console.log(`Fetching document: ${document_id}`);
        return {
            title: 'Full Document Title',
            content: 'The complete content of the document goes here.',
            url: `https://yourdomain.com/docs/${document_id}`
        };
    }
}
// 2. Initialize the MCP Server with ALL required properties.
// ERROR FIX 1: Add the required 'version' field. 
// Also, define tools within a 'capabilities' object structure if using the McpServer class directly.
const mcpServerConfig = {
    // The 'version' property is REQUIRED by the Model Context Protocol (MCP) specification.
    version: "1.0.0",
    name: "MyCustomMCP",
    description: "A custom MCP server for external data access.",
    // You can define tools in the config if you want, but for the Express adapter, 
    // it's cleaner to pass the tools object directly to the adapter function.
};
const customToolsInstance = new CustomTools();
// 3. Create an Express app and expose the MCP endpoint
const app = express();
// ERROR FIX 2: Use the Express utility function to create the router.
// McpServer class instances don't have a '.router' property directly.
// The createExpressMcpRouter function wraps the McpServer logic and returns an Express Router.
const mcpRouter = createExpressMcpRouter({
    ...mcpServerConfig,
    // The tools are passed here
    tools: customToolsInstance,
});
// Use the created router at the /mcp endpoint
app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/mcp', mcpRouter);
const port = 3000;
app.listen(port, () => {
    console.log(`✅ MCP server running at http://localhost:${port}/mcp`);
});
//# sourceMappingURL=index.js.map