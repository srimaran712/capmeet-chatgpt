// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // ... (existing middleware and sample meetings data remains the same)

// // --- Recordings API Integration ---

// // Mock recordings data (replace with your actual API calls)
// const sampleRecordings = {
//   audioRecordings: [
//     {
//       id: 'audio_1',
//       filename: 'team_meeting_2024.mp3',
//       originalName: 'team_meeting_2024.mp3',
//       mimeType: 'audio/mpeg',
//       size: 1024000,
//       path: '/recordings/audio/team_meeting_2024.mp3',
//       fileStatus: 'processed',
//       transcriptionStatus: 'completed',
//       summaryStatus: 'completed',
//       createdAt: new Date('2024-01-15T10:00:00Z'),
//       updatedAt: new Date('2024-01-15T11:30:00Z'),
//       transcript: 'In today\'s meeting we discussed the Q4 roadmap and feature priorities...',
//       chunksPath: '/chunks/audio_1',
//       summary: 'Discussion about Q4 product roadmap, feature priorities, and resource allocation.',
//       duration: 1800
//     }
//   ],
//   videoRecordings: [
//     {
//       id: 'video_1',
//       filename: 'client_demo_2024.mp4',
//       originalName: 'client_demo_2024.mp4',
//       mimeType: 'video/mp4',
//       size: 5120000,
//       path: '/recordings/video/client_demo_2024.mp4',
//       fileStatus: 'processed',
//       transcriptionStatus: 'completed',
//       summaryStatus: 'completed',
//       summary: 'Product demo for Acme Corporation showing new features and capabilities.',
//       createdAt: new Date('2024-01-16T14:00:00Z'),
//       updatedAt: new Date('2024-01-16T15:30:00Z'),
//       thumbnail: '/thumbnails/video_1.jpg',
//       duration: 2400
//     }
//   ]
// };

// // Function to call your recordings API
// async function getUserRecordings(accessToken: string) {
//   // Replace this with actual API call to your recordings service
//   try {
//     // Example of calling your API:
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000); 
//     const response = await fetch('https://api.capmeet.ai/recordings/my-recordings', {
//       headers: {
//         'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
//         'Content-Type': 'application/json'
//       },
//       signal: controller.signal
//     });
//     clearTimeout(timeout);
//      if (!response.ok) {
//       throw new Error(`API responded with ${response.status}`);
//     }
//     return await response.json();
    
//     // For now, return mock data
//    // return sampleRecordings;
//   } catch (error) {
//     console.error('Error fetching recordings:', error);
//     return error; // Fallback to sample data
//   }
// }

// // Function to call your global search API
// async function globalSearch(accessToken: string, search: string, type?: string, date?: string) {
//   // Replace this with actual API call to your search service
//   try {
//     // Example:
//     // const params = new URLSearchParams();
//     // if (search) params.append('search', search);
//     // if (type) params.append('type', type);
//     // if (date) params.append('date', date);
    
//     // const response = await fetch(`YOUR_SEARCH_API_URL/search?${params}`, {
//     //   headers: {
//     //     'Authorization': `Bearer ${accessToken}`,
//     //     'Content-Type': 'application/json'
//     //   }
//     // });
//     // return await response.json();
    
//     // Mock search results
//     return {
//       recordings: [
//         {
//           id: 'audio_1',
//           type: 'audio',
//           filename: 'team_meeting_2024.mp3',
//           summary: 'Discussion about Q4 product roadmap...',
//           createdAt: new Date('2024-01-15T10:00:00Z'),
//           duration: 1800
//         }
//       ],
//       transcripts: [
//         {
//           recordingId: 'audio_1',
//           text: 'In today\'s meeting we discussed the Q4 roadmap...',
//           highlights: ['Q4 roadmap', 'feature priorities']
//         }
//       ]
//     };
//   } catch (error) {
//     console.error('Error searching recordings:', error);
//     return { recordings: [], transcripts: [] };
//   }
// }

// // ... (existing utility functions remain the same)

// // Format recording card for display
// function formatRecordingCard(recording: any, type: 'audio' | 'video'): string {
//   const emoji = type === 'audio' ? '🎵' : '🎥';
//   const duration = recording.duration ? `${Math.round(recording.duration / 60)} min` : 'Unknown';
  
//   let card = `### ${emoji} ${recording.originalName || recording.filename}\n\n`;
//   card += `**📊 Type:** ${type === 'audio' ? 'Audio' : 'Video'}\n`;
//   card += `**⏱️ Duration:** ${duration}\n`;
//   card += `**📅 Recorded:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
//   card += `**📝 Status:** ${recording.transcriptionStatus}\n`;
  
//   if (recording.summary) {
//     card += `**📋 Summary:** ${recording.summary}\n`;
//   }
  
//   if (recording.transcript) {
//     const preview = recording.transcript.length > 150 
//       ? recording.transcript.substring(0, 150) + '...' 
//       : recording.transcript;
//     card += `**💬 Transcript Preview:** ${preview}\n`;
//   }
  
//   card += '\n---\n\n';
//   return card;
// }

// // --- JSON-RPC 2.0 Response Helper ---
// function jsonRpcSuccess(id: any, result: any) {
//   return {
//     jsonrpc: '2.0',
//     id,
//     result
//   };
// }

// function jsonRpcError(id: any, code: number, message: string, data?: any) {
//   return {
//     jsonrpc: '2.0',
//     id,
//     error: {
//       code,
//       message,
//       ...(data && { data })
//     }
//   };
// }
// // Update the MCP JSON-RPC Handler to include recordings tools
// app.post('/mcp', async (req: Request, res: Response) => {
//   const { jsonrpc, method, id, params } = req.body;

//   if (jsonrpc !== '2.0') {
//     return res.status(400).json(jsonRpcError(id, -32600, 'Invalid Request'));
//   }

//   try {
//     switch (method) {
//       case 'initialize': {
//         const response = jsonRpcSuccess(id, {
//           protocolVersion: '2025-03-26',
//           capabilities: {
//             tools: {}
//           },
//           serverInfo: {
//             name: 'meetings-recordings-mcp-server',
//             version: '1.0.0'
//           }
//         });
//         return res.json(response);
//       }

//       case 'tools/list': {
//         const response = jsonRpcSuccess(id, {
//           tools: [
//             // Existing meeting tools...
//             {
//               name: 'getMeetings',
//               description: 'Retrieves upcoming meetings and calendar events.',
//               // ... existing meeting tool config
//             },
//             {
//               name: 'summarizeMeeting',
//               description: 'Generates a comprehensive AI-powered summary from meeting transcripts.',
//               // ... existing meeting tool config
//             },
//             // NEW RECORDINGS TOOLS
//             {
//               name: 'getRecordings',
//               description: 'Retrieves user\'s audio and video recordings with transcripts and summaries. Use when user asks about their recordings, past meetings, or stored media files.',
//               inputSchema: {
//                 type: 'object',
//                 properties: {
//                   type: {
//                     type: 'string',
//                     description: 'Filter by type: "audio", "video", or "all"',
//                     enum: ['audio', 'video', 'all'],
//                     default: 'all'
//                   },
//                   limit: {
//                     type: 'number',
//                     description: 'Maximum number of recordings to return',
//                     default: 20
//                   }
//                 }
//               },
//               metadata: {
//                 invokingMessage: 'Fetching your recordings...',
//                 invokedMessage: 'Found your recordings!',
//                 outputTemplate: 'ui://widget/recordings-list.html'
//               }
//             },
//             {
//               name: 'searchRecordings',
//               description: 'Search through recordings and transcripts for specific content. Use when user wants to find recordings by topic, date, or specific keywords mentioned in transcripts.',
//               inputSchema: {
//                 type: 'object',
//                 properties: {
//                   query: {
//                     type: 'string',
//                     description: 'Search query - keywords, topics, or phrases to search for',
//                     required: true
//                   },
//                   type: {
//                     type: 'string',
//                     description: 'Filter by media type',
//                     enum: ['audio', 'video', 'all'],
//                     default: 'all'
//                   },
//                   date: {
//                     type: 'string',
//                     description: 'Filter by date (YYYY-MM-DD) or relative time like "last week", "this month"'
//                   }
//                 },
//                 required: ['query']
//               },
//               metadata: {
//                 invokingMessage: 'Searching your recordings...',
//                 invokedMessage: 'Search complete!',
//                 outputTemplate: 'ui://widget/search-results.html'
//               }
//             }
//           ]
//         });
//         return res.json(response);
//       }

//       case 'tools/call': {
//         const { name, arguments: args } = params || {};

//         if (!name) {
//           return res.json(jsonRpcError(id, -32602, 'Invalid params: tool name required'));
//         }

//         switch (name) {
//           case 'getMeetings': {
//             // ... existing meetings code
//           }

//           case 'summarizeMeeting': {
//             // ... existing summarize code
//           }

//           // NEW RECORDINGS TOOL IMPLEMENTATION
//           case 'getRecordings': {
//             const accessToken = req.headers.authorization?.split(' ')[1] || '';
//             const type = args?.type || 'all';
//             const limit = args?.limit || 20;
            
//             const recordings = await getUserRecordings(accessToken);
            
//             let formattedText = '# 🎵 Your Recordings\n\n';
            
//             // Filter by type if specified
//             let audioRecordings = recordings.audioRecordings || [];
//             let videoRecordings = recordings.videoRecordings || [];
            
//             if (type === 'audio') {
//               videoRecordings = [];
//             } else if (type === 'video') {
//               audioRecordings = [];
//             }
            
//             // Apply limit
//             audioRecordings = audioRecordings.slice(0, limit);
//             videoRecordings = videoRecordings.slice(0, limit);
            
//             if (audioRecordings.length > 0) {
//               formattedText += '## 🎧 Audio Recordings\n\n';
//               audioRecordings.forEach((recording: any, index: number) => {
//                 formattedText += formatRecordingCard(recording, 'audio');
//               });
//             }
            
//             if (videoRecordings.length > 0) {
//               formattedText += '## 🎥 Video Recordings\n\n';
//               videoRecordings.forEach((recording: any, index: number) => {
//                 formattedText += formatRecordingCard(recording, 'video');
//               });
//             }
            
//             if (audioRecordings.length === 0 && videoRecordings.length === 0) {
//               formattedText += 'No recordings found.\n\n';
//             }
            
//             formattedText += `\n---\n\n`;
//             formattedText += `📊 **Total:** ${audioRecordings.length + videoRecordings.length} recordings | `;
//             formattedText += `🎧 **Audio:** ${audioRecordings.length} | `;
//             formattedText += `🎥 **Video:** ${videoRecordings.length}\n\n`;
//             formattedText += `💡 *Tip: Use "searchRecordings" to find specific content in your recordings!*`;

//             const response = jsonRpcSuccess(id, {
//               content: [
//                 { 
//                   type: 'text',
//                   text: formattedText
//                 }
//               ],
//               metadata: {
//                 status: 'success',
//                 totalRecordings: audioRecordings.length + videoRecordings.length,
//                 audioCount: audioRecordings.length,
//                 videoCount: videoRecordings.length
//               }
//             });
//             return res.json(response);
//           }

//           case 'searchRecordings': {
//             const accessToken = req.headers.authorization?.split(' ')[1] || '';
//             const query = args?.query;
//             const type = args?.type || 'all';
//             const date = args?.date;
            
//             if (!query) {
//               return res.json(jsonRpcError(id, -32602, 'Invalid params: search query required'));
//             }

//             const searchResults = await globalSearch(accessToken, query, type, date);
            
//             let formattedText = `# 🔍 Search Results for "${query}"\n\n`;
            
//             if (searchResults.recordings.length === 0 && searchResults.transcripts.length === 0) {
//               formattedText += 'No results found for your search query.\n\n';
//             } else {
//               if (searchResults.recordings.length > 0) {
//                 formattedText += '## 📁 Matching Recordings\n\n';
//                 searchResults.recordings.forEach((recording: any) => {
//                   formattedText += `### ${recording.type === 'audio' ? '🎵' : '🎥'} ${recording.filename}\n`;
//                   formattedText += `**📅 Date:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
//                   if (recording.summary) {
//                     formattedText += `**📋 Summary:** ${recording.summary}\n`;
//                   }
//                   formattedText += `**⏱️ Duration:** ${recording.duration ? Math.round(recording.duration / 60) + ' min' : 'Unknown'}\n\n`;
//                 });
//               }
              
//               if (searchResults.transcripts.length > 0) {
//                 formattedText += '## 💬 Matching Transcripts\n\n';
//                 searchResults.transcripts.forEach((transcript: any, index: number) => {
//                   formattedText += `### Result ${index + 1}\n`;
//                   formattedText += `**📁 Recording:** ${transcript.recordingId}\n`;
//                   formattedText += `**📝 Excerpt:** ${transcript.text}\n`;
//                   if (transcript.highlights && transcript.highlights.length > 0) {
//                     formattedText += `**🔍 Keywords:** ${transcript.highlights.join(', ')}\n`;
//                   }
//                   formattedText += '\n---\n\n';
//                 });
//               }
//             }
            
//             formattedText += `\n---\n\n`;
//             formattedText += `📊 **Found:** ${searchResults.recordings.length} recordings, ${searchResults.transcripts.length} transcript matches\n\n`;

//             const response = jsonRpcSuccess(id, {
//               content: [
//                 { 
//                   type: 'text',
//                   text: formattedText
//                 }
//               ],
//               metadata: {
//                 status: 'success',
//                 query: query,
//                 recordingsFound: searchResults.recordings.length,
//                 transcriptsFound: searchResults.transcripts.length
//               }
//             });
//             return res.json(response);
//           }

//           default:
//             return res.json(jsonRpcError(id, -32601, `Unknown tool: ${name}`));
//         }
//       }

//       // ... rest of the existing methods remain the same
//     }
//   } catch (error) {
//     console.error('Error handling JSON-RPC request:', error);
//     return res.json(jsonRpcError(
//       id, 
//       -32603, 
//       'Internal error',
//       error instanceof Error ? error.message : 'Unknown error'
//     ));
//   }
// });

// // ... rest of the existing server code (SSE, dashboard, etc.) remains the same

// // Add recordings API endpoint
// app.get('/api/recordings', async (req: Request, res: Response) => {
//   const accessToken = req.headers.authorization?.split(' ')[1] || '';
//   const recordings = await getUserRecordings(accessToken);
//   res.json(recordings);
// });

// // Update dashboard to include recordings
// app.get('/dashboard', (req: Request, res: Response) => {
//   // Update the HTML to include recordings section
//   // Add tabs or sections for recordings in the dashboard
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Meetings & Recordings MCP Server</title>
//         <style>
//             /* Add recordings-specific styles */
//             .recordings-stats {
//                 display: grid;
//                 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//                 gap: 16px;
//                 margin-bottom: 24px;
//             }
//             .tab-container {
//                 margin-bottom: 24px;
//             }
//             .tab-buttons {
//                 display: flex;
//                 gap: 8px;
//                 margin-bottom: 16px;
//             }
//             .tab-button {
//                 padding: 12px 24px;
//                 border: none;
//                 border-radius: 8px;
//                 background: #e2e8f0;
//                 color: #4a5568;
//                 cursor: pointer;
//                 font-weight: 500;
//             }
//             .tab-button.active {
//                 background: #667eea;
//                 color: white;
//             }
//             .tab-content {
//                 display: none;
//             }
//             .tab-content.active {
//                 display: block;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <h1>🗓️ Meetings & Recordings Dashboard</h1>
//                 <p>MCP Server for ChatGPT - Manage meetings and recordings</p>
//             </div>

//             <div class="tab-container">
//                 <div class="tab-buttons">
//                     <button class="tab-button active" onclick="showTab('meetings')">Meetings</button>
//                     <button class="tab-button" onclick="showTab('recordings')">Recordings</button>
//                 </div>
                
//                 <div id="meetings-tab" class="tab-content active">
//                     <!-- Existing meetings content -->
//                     <div class="stats">
//                         <!-- meetings stats -->
//                     </div>
//                     <div class="meetings-grid" id="meetingsContainer"></div>
//                 </div>
                
//                 <div id="recordings-tab" class="tab-content">
//                     <div class="recordings-stats">
//                         <div class="stat-card">
//                             <div class="stat-value" id="totalRecordings">0</div>
//                             <div class="stat-label">Total Recordings</div>
//                         </div>
//                         <div class="stat-card">
//                             <div class="stat-value" id="audioRecordings">0</div>
//                             <div class="stat-label">Audio</div>
//                         </div>
//                         <div class="stat-card">
//                             <div class="stat-value" id="videoRecordings">0</div>
//                             <div class="stat-label">Video</div>
//                         </div>
//                         <div class="stat-card">
//                             <button class="refresh-btn" onclick="loadRecordings()">🔄 Refresh</button>
//                         </div>
//                     </div>
//                     <div id="recordingsContainer"></div>
//                     <div id="videoRecordingsContainer"></div>
//                 </div>
//             </div>
//         </div>

//         <script>
//             function showTab(tabName) {
//                 // Hide all tabs
//                 document.querySelectorAll('.tab-content').forEach(tab => {
//                     tab.classList.remove('active');
//                 });
//                 document.querySelectorAll('.tab-button').forEach(btn => {
//                     btn.classList.remove('active');
//                 });
                
//                 // Show selected tab
//                 document.getElementById(tabName + '-tab').classList.add('active');
//                 event.target.classList.add('active');
//             }

//             async function loadRecordings() {
//                 try {
//                     const response = await fetch('/api/recordings');
//                     const recordings = await response.json();
                    
//                     document.getElementById('totalRecordings').textContent = 
//                         recordings.audioRecordings.length + recordings.videoRecordings.length;
//                     document.getElementById('audioRecordings').textContent = recordings.audioRecordings.length;
//                     document.getElementById('videoRecordings').textContent = recordings.videoRecordings.length;
                    
//                     // Render recordings in the container
//                     const container = document.getElementById('recordingsContainer');
//                     // Add your recordings rendering logic here
//                     container.innerHTML = '';
//                     recordings.audioRecordings.forEach(recording => {
//                         const div = document.createElement('div');
//                         div.className = 'recording';
                        
//                         const title = document.createElement('h3');
//                         title.textContent = recording.filename || 'Untitled Recording';
                        
//                         const mimeType = document.createElement('p');
//                         mimeType.textContent = 'Type: ' + (recording.mimeType || 'N/A');
                        
//                         const date = document.createElement('p');
//                         date.textContent = 'Created: ' + (recording.created_at ? new Date(recording.created_at).toLocaleString() : 'Date not available');
                        
//                         const transcript = document.createElement('p');
//                         transcript.textContent = recording.transcript || 'No transcript available';
                        
//                         div.appendChild(title);
//                         div.appendChild(mimeType);
//                         div.appendChild(date);
//                         div.appendChild(transcript);
//                         container.appendChild(div);
//                     });
//                 } catch (error) {
//                     console.error('Error loading recordings:', error);
//                 }
//             }

//             // Load initial data
//             loadMeetings();
//             loadRecordings();
//         </script>
//     </body>
//     </html>
//   `);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`📍 MCP Endpoint: http://localhost:${PORT}/mcp`);
//   console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
//   console.log(`🎵 Recordings API: http://localhost:${PORT}/api/recordings`);
//   console.log(`💚 Health Check: http://localhost:${PORT}/health`);
// });

// export default app;
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control']
// }));
// app.use(express.json());

// // Logging middleware for debugging
// app.use((req, _res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   if (req.body && Object.keys(req.body).length > 0) {
//     console.log('Body:', JSON.stringify(req.body, null, 2));
//   }
//   next();
// });

// // --- Sample Meeting Data ---
// const sampleMeetings = [
//   {
//     id: '1',
//     summary: '🚀 Product Roadmap Planning',
//     description: 'Q4 2025 product roadmap review and planning session',
//     start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
//     end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
//     location: 'Conference Room A',
//     attendees: [
//       { email: 'gokul@nfnlabs.in', displayName: 'Gokul', responseStatus: 'accepted' },
//       { email: 'mahathi@nfnlabs.in', displayName: 'Mahathi', responseStatus: 'accepted' },
//       { email: 'hamsraj@nfnlabs.in', displayName: 'Hamsraj', responseStatus: 'tentative' },
//       { email: 'you@nfnlabs.in', displayName: 'You', self: true, responseStatus: 'accepted' }
//     ],
//     organizer: { email: 'mahathi@nfnlabs.in', displayName: 'Mahathi' },
//     status: 'confirmed'
//   }
//   // ... add other sample meetings as needed
// ];

// // --- Recordings API Integration ---
// const sampleRecordings = {
//   audioRecordings: [
//     {
//       id: 'audio_1',
//       filename: 'team_meeting_2024.mp3',
//       originalName: 'team_meeting_2024.mp3',
//       mimeType: 'audio/mpeg',
//       size: 1024000,
//       path: '/recordings/audio/team_meeting_2024.mp3',
//       fileStatus: 'processed',
//       transcriptionStatus: 'completed',
//       summaryStatus: 'completed',
//       createdAt: new Date('2024-01-15T10:00:00Z'),
//       updatedAt: new Date('2024-01-15T11:30:00Z'),
//       transcript: 'In today\'s meeting we discussed the Q4 roadmap and feature priorities...',
//       chunksPath: '/chunks/audio_1',
//       summary: 'Discussion about Q4 product roadmap, feature priorities, and resource allocation.',
//       duration: 1800
//     }
//   ],
//   videoRecordings: [
//     {
//       id: 'video_1',
//       filename: 'client_demo_2024.mp4',
//       originalName: 'client_demo_2024.mp4',
//       mimeType: 'video/mp4',
//       size: 5120000,
//       path: '/recordings/video/client_demo_2024.mp4',
//       fileStatus: 'processed',
//       transcriptionStatus: 'completed',
//       summaryStatus: 'completed',
//       summary: 'Product demo for Acme Corporation showing new features and capabilities.',
//       createdAt: new Date('2024-01-16T14:00:00Z'),
//       updatedAt: new Date('2024-01-16T15:30:00Z'),
//       thumbnail: '/thumbnails/video_1.jpg',
//       duration: 2400
//     }
//   ]
// };

// // Function to call your recordings API
// async function getUserRecordings(accessToken: string) {
//   try {
//     // Uncomment and use this for real API calls
//     /*
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000); 
//     const response = await fetch('https://api.capmeet.ai/recordings/my-recordings', {
//       headers: {
//         'Authorization': `Bearer ${process.env.AUTH_TOKEN || accessToken}`,
//         'Content-Type': 'application/json'
//       },
//       signal: controller.signal
//     });
//     clearTimeout(timeout);
//     if (!response.ok) {
//       throw new Error(`API responded with ${response.status}`);
//     }
//     return await response.json();
//     */
    
//     // For testing, return mock data
//     console.log('Returning sample recordings data');
//     return sampleRecordings;
//   } catch (error) {
//     console.error('Error fetching recordings:', error);
//     return sampleRecordings; // Fallback to sample data
//   }
// }

// // Function to call your global search API
// async function globalSearch(accessToken: string, search: string, type?: string, date?: string) {
//   try {
//     // Mock search results for testing
//     return {
//       recordings: [
//         {
//           id: 'audio_1',
//           type: 'audio',
//           filename: 'team_meeting_2024.mp3',
//           summary: 'Discussion about Q4 product roadmap...',
//           createdAt: new Date('2024-01-15T10:00:00Z'),
//           duration: 1800
//         }
//       ],
//       transcripts: [
//         {
//           recordingId: 'audio_1',
//           text: 'In today\'s meeting we discussed the Q4 roadmap...',
//           highlights: ['Q4 roadmap', 'feature priorities']
//         }
//       ]
//     };
//   } catch (error) {
//     console.error('Error searching recordings:', error);
//     return { recordings: [], transcripts: [] };
//   }
// }

// // --- Utility functions ---
// async function getGoogleCalendarEvents(accessToken: string) {
//   return sampleMeetings;
// }

// function formatMeetingCard(meeting: any, index: number): string {
//   const startDate = new Date(meeting.start.dateTime);
//   const endDate = new Date(meeting.end.dateTime);
//   const timeStr = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  
//   const selfAttendee = meeting.attendees?.find((a: any) => a.self);
//   let statusEmoji = '✅';
//   let statusText = 'Accepted';
//   if (selfAttendee) {
//     if (selfAttendee.responseStatus === 'tentative') {
//       statusEmoji = '❓';
//       statusText = 'Tentative';
//     } else if (selfAttendee.responseStatus === 'needsAction') {
//       statusEmoji = '⏳';
//       statusText = 'Needs Response';
//     }
//   }
  
//   let card = `### ${meeting.summary}\n\n`;
//   card += `**⏰ Time:** ${timeStr}\n`;
//   card += `**${statusEmoji} Status:** ${statusText}\n`;
  
//   if (meeting.location) {
//     card += `**📍 Location:** ${meeting.location}\n`;
//   }
  
//   if (meeting.description) {
//     card += `**📝 Description:** ${meeting.description}\n`;
//   }
  
//   card += '\n---\n\n';
//   return card;
// }

// // Format recording card for display
// function formatRecordingCard(recording: any, type: 'audio' | 'video'): string {
//   const emoji = type === 'audio' ? '🎵' : '🎥';
//   const duration = recording.duration ? `${Math.round(recording.duration / 60)} min` : 'Unknown';
  
//   let card = `### ${emoji} ${recording.originalName || recording.filename}\n\n`;
//   card += `**📊 Type:** ${type === 'audio' ? 'Audio' : 'Video'}\n`;
//   card += `**⏱️ Duration:** ${duration}\n`;
//   card += `**📅 Recorded:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
//   card += `**📝 Status:** ${recording.transcriptionStatus}\n`;
  
//   if (recording.summary) {
//     card += `**📋 Summary:** ${recording.summary}\n`;
//   }
  
//   card += '\n---\n\n';
//   return card;
// }

// // --- JSON-RPC 2.0 Response Helper ---
// function jsonRpcSuccess(id: any, result: any) {
//   return {
//     jsonrpc: '2.0',
//     id,
//     result
//   };
// }

// function jsonRpcError(id: any, code: number, message: string, data?: any) {
//   return {
//     jsonrpc: '2.0',
//     id,
//     error: {
//       code,
//       message,
//       ...(data && { data })
//     }
//   };
// }

// // --- Critical Fix: Proper SSE Endpoint for MCP ---
// app.get('/mcp', (req: Request, res: Response) => {
//   console.log('SSE connection requested');
  
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Cache-Control'
//   });

//   // Send initial server/ready event
//   const readyEvent = {
//     jsonrpc: '2.0',
//     method: 'server/ready',
//     params: {
//       serverInfo: {
//         name: 'meetings-recordings-mcp-server',
//         version: '1.0.0'
//       }
//     }
//   };

//   res.write(`data: ${JSON.stringify(readyEvent)}\n\n`);
//   console.log('Sent server/ready event');

//   // Keep connection alive
//   const keepAlive = setInterval(() => {
//     res.write(': keepalive\n\n');
//   }, 30000);

//   req.on('close', () => {
//     console.log('SSE connection closed');
//     clearInterval(keepAlive);
//     res.end();
//   });
// });

// // --- MCP JSON-RPC Handler ---
// app.post('/mcp', async (req: Request, res: Response) => {
//   console.log('MCP JSON-RPC request received:', req.body);
  
//   const { jsonrpc, method, id, params } = req.body;

//   if (jsonrpc !== '2.0') {
//     return res.status(400).json(jsonRpcError(id, -32600, 'Invalid Request'));
//   }

//   try {
//     switch (method) {
//       case 'initialize': {
//         console.log('Initialize method called');
//         const response = jsonRpcSuccess(id, {
//           protocolVersion: '2025-03-26',
//           capabilities: {
//             roots: {},
//             sampling: {}
//           },
//           serverInfo: {
//             name: 'meetings-recordings-mcp-server',
//             version: '1.0.0'
//           }
//         });
//         return res.json(response);
//       }

//       case 'tools/list': {
//         console.log('Tools/list method called');
//         const response = jsonRpcSuccess(id, {
//           tools: [
//             {
//               name: 'getMeetings',
//               description: 'Retrieves upcoming meetings and calendar events. Use when user asks about schedule, meetings, or calendar.',
//               inputSchema: {
//                 type: 'object',
//                 properties: {
//                   maxResults: {
//                     type: 'number',
//                     description: 'Maximum number of meetings to return',
//                     default: 10
//                   }
//                 }
//               }
//             },
//             {
//               name: 'getRecordings',
//               description: 'Retrieves user\'s audio and video recordings with transcripts and summaries. Use when user asks about recordings, past meetings, or stored media.',
//               inputSchema: {
//                 type: 'object',
//                 properties: {
//                   type: {
//                     type: 'string',
//                     description: 'Filter by type: audio, video, or all',
//                     enum: ['audio', 'video', 'all'],
//                     default: 'all'
//                   },
//                   limit: {
//                     type: 'number',
//                     description: 'Maximum number of recordings to return',
//                     default: 20
//                   }
//                 }
//               }
//             },
//             {
//               name: 'searchRecordings',
//               description: 'Search through recordings and transcripts for specific content. Use when user wants to find recordings by topic or keywords.',
//               inputSchema: {
//                 type: 'object',
//                 properties: {
//                   query: {
//                     type: 'string',
//                     description: 'Search keywords or phrases',
//                     required: true
//                   },
//                   type: {
//                     type: 'string',
//                     description: 'Filter by media type',
//                     enum: ['audio', 'video', 'all'],
//                     default: 'all'
//                   }
//                 },
//                 required: ['query']
//               }
//             }
//           ]
//         });
//         return res.json(response);
//       }

//       case 'tools/call': {
//         const { name, arguments: args } = params || {};
//         console.log(`Tools/call method called: ${name}`, args);

//         if (!name) {
//           return res.json(jsonRpcError(id, -32602, 'Invalid params: tool name required'));
//         }

//         switch (name) {
//           case 'getMeetings': {
//             const accessToken = req.headers.authorization?.split(' ')[1] || '';
//             const maxResults = args?.maxResults || 10;
//             const allMeetings = await getGoogleCalendarEvents(accessToken);
//             const meetings = allMeetings.slice(0, maxResults);
            
//             let formattedText = '# 📅 Your Upcoming Meetings\n\n';
//             meetings.forEach((meeting: any, index: number) => {
//               formattedText += formatMeetingCard(meeting, index + 1);
//             });
            
//             formattedText += `\n📊 **Total Meetings:** ${meetings.length}\n`;

//             const response = jsonRpcSuccess(id, {
//               content: [
//                 { 
//                   type: 'text',
//                   text: formattedText
//                 }
//               ]
//             });
//             return res.json(response);
//           }

//           case 'getRecordings': {
//             const accessToken = req.headers.authorization?.split(' ')[1] || '';
//             const type = args?.type || 'all';
//             const limit = args?.limit || 20;
            
//             const recordings = await getUserRecordings(accessToken);
            
//             let formattedText = '# 🎵 Your Recordings\n\n';
            
//             let audioRecordings = recordings.audioRecordings || [];
//             let videoRecordings = recordings.videoRecordings || [];
            
//             if (type === 'audio') {
//               videoRecordings = [];
//             } else if (type === 'video') {
//               audioRecordings = [];
//             }
            
//             audioRecordings = audioRecordings.slice(0, limit);
//             videoRecordings = videoRecordings.slice(0, limit);
            
//             if (audioRecordings.length > 0) {
//               formattedText += '## 🎧 Audio Recordings\n\n';
//               audioRecordings.forEach((recording: any) => {
//                 formattedText += formatRecordingCard(recording, 'audio');
//               });
//             }
            
//             if (videoRecordings.length > 0) {
//               formattedText += '## 🎥 Video Recordings\n\n';
//               videoRecordings.forEach((recording: any) => {
//                 formattedText += formatRecordingCard(recording, 'video');
//               });
//             }
            
//             if (audioRecordings.length === 0 && videoRecordings.length === 0) {
//               formattedText += 'No recordings found.\n\n';
//             }
            
//             formattedText += `\n📊 **Total:** ${audioRecordings.length + videoRecordings.length} recordings\n`;

//             const response = jsonRpcSuccess(id, {
//               content: [
//                 { 
//                   type: 'text',
//                   text: formattedText
//                 }
//               ]
//             });
//             return res.json(response);
//           }

//           case 'searchRecordings': {
//             const accessToken = req.headers.authorization?.split(' ')[1] || '';
//             const query = args?.query;
//             const type = args?.type || 'all';
            
//             if (!query) {
//               return res.json(jsonRpcError(id, -32602, 'Invalid params: search query required'));
//             }

//             const searchResults = await globalSearch(accessToken, query, type);
            
//             let formattedText = `# 🔍 Search Results for "${query}"\n\n`;
            
//             if (searchResults.recordings.length === 0 && searchResults.transcripts.length === 0) {
//               formattedText += 'No results found for your search query.\n\n';
//             } else {
//               if (searchResults.recordings.length > 0) {
//                 formattedText += '## 📁 Matching Recordings\n\n';
//                 searchResults.recordings.forEach((recording: any) => {
//                   formattedText += `### ${recording.type === 'audio' ? '🎵' : '🎥'} ${recording.filename}\n`;
//                   formattedText += `**📅 Date:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
//                   if (recording.summary) {
//                     formattedText += `**📋 Summary:** ${recording.summary}\n`;
//                   }
//                   formattedText += `**⏱️ Duration:** ${recording.duration ? Math.round(recording.duration / 60) + ' min' : 'Unknown'}\n\n`;
//                 });
//               }
//             }
            
//             formattedText += `\n📊 **Found:** ${searchResults.recordings.length} recordings\n`;

//             const response = jsonRpcSuccess(id, {
//               content: [
//                 { 
//                   type: 'text',
//                   text: formattedText
//                 }
//               ]
//             });
//             return res.json(response);
//           }

//           default:
//             return res.json(jsonRpcError(id, -32601, `Unknown tool: ${name}`));
//         }
//       }

//       case 'notifications/initialized': {
//         console.log('Notifications/initialized method called');
//         return res.status(204).end();
//       }

//       case 'ping': {
//         console.log('Ping method called');
//         return res.json(jsonRpcSuccess(id, {}));
//       }

//       default:
//         console.log(`Unknown method: ${method}`);
//         return res.json(jsonRpcError(id, -32601, `Method not found: ${method}`));
//     }
//   } catch (error) {
//     console.error('Error handling JSON-RPC request:', error);
//     return res.json(jsonRpcError(
//       id, 
//       -32603, 
//       'Internal error',
//       error instanceof Error ? error.message : 'Unknown error'
//     ));
//   }
// });

// // --- Additional endpoints ---
// app.get('/api/recordings', async (req: Request, res: Response) => {
//   const accessToken = req.headers.authorization?.split(' ')[1] || '';
//   const recordings = await getUserRecordings(accessToken);
//   res.json(recordings);
// });

// app.get('/health', (req: Request, res: Response) => {
//   res.json({ 
//     status: 'ok', 
//     timestamp: new Date().toISOString(),
//     server: 'Meetings & Recordings MCP Server'
//   });
// });

// app.get('/', (req: Request, res: Response) => {
//   res.json({
//     name: 'Meetings & Recordings MCP Server',
//     version: '1.0.0',
//     endpoints: {
//       mcp: {
//         sse: 'GET /mcp',
//         jsonrpc: 'POST /mcp'
//       },
//       api: '/api/recordings',
//       health: '/health'
//     }
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 MCP Server running on port ${PORT}`);
//   console.log(`📍 MCP Endpoint: http://localhost:${PORT}/mcp`);
//   console.log(`💚 Health Check: http://localhost:${PORT}/health`);
//   console.log(`📋 Protocol: MCP (JSON-RPC 2.0 + SSE)`);
// });

// export default app;
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Enhanced CORS configuration
app.use(cors({
  origin: IS_PRODUCTION ? [
    'https://chatgpt.com',
    'https://www.chatgpt.com',
    'https://openai.com',
    'https://chat.openai.com',
    'https://capmeet-chatgpt-1.onrender.com'
  ] : '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

// Security headers middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  if (IS_PRODUCTION) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

app.use(express.json());

// Enhanced logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Handle preflight OPTIONS requests
app.options('*', (req: Request, res: Response) => {
  console.log('OPTIONS preflight request for:', req.url);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
});

// --- Sample Meeting Data ---
const sampleMeetings = [
  {
    id: '1',
    summary: '🚀 Product Roadmap Planning',
    description: 'Q4 2025 product roadmap review and planning session',
    start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
    location: 'Conference Room A',
    attendees: [
      { email: 'gokul@nfnlabs.in', displayName: 'Gokul', responseStatus: 'accepted' },
      { email: 'mahathi@nfnlabs.in', displayName: 'Mahathi', responseStatus: 'accepted' },
      { email: 'hamsraj@nfnlabs.in', displayName: 'Hamsraj', responseStatus: 'tentative' },
      { email: 'you@nfnlabs.in', displayName: 'You', self: true, responseStatus: 'accepted' }
    ],
    organizer: { email: 'mahathi@nfnlabs.in', displayName: 'Mahathi' },
    status: 'confirmed'
  },
  {
    id: '2',
    summary: '💼 Client Demo - Acme Corp',
    description: 'Product demo for Acme Corporation stakeholders',
    start: { dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() },
    location: 'Zoom Meeting',
    attendees: [
      { email: 'david@acme.com', displayName: 'David Brown', responseStatus: 'accepted' },
      { email: 'lisa@acme.com', displayName: 'Lisa Wang', responseStatus: 'accepted' },
      { email: 'rajesh@nfnlabs.in', displayName: 'Rajesh', responseStatus: 'accepted' },
      { email: 'you@nfnlabs.in', displayName: 'You', self: true, responseStatus: 'accepted' }
    ],
    organizer: { email: 'you@nfnlabs.in', displayName: 'You', self: true },
    status: 'confirmed',
    hangoutLink: 'https://meet.google.com/abc-defg-hij'
  }
];

// --- Recordings Data ---
const sampleRecordings = {
  audioRecordings: [
    {
      id: 'audio_1',
      filename: 'team_meeting_2024.mp3',
      originalName: 'team_meeting_2024.mp3',
      mimeType: 'audio/mpeg',
      size: 1024000,
      path: '/recordings/audio/team_meeting_2024.mp3',
      fileStatus: 'processed',
      transcriptionStatus: 'completed',
      summaryStatus: 'completed',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T11:30:00Z'),
      transcript: 'In today\'s meeting we discussed the Q4 roadmap and feature priorities. The team agreed to focus on user experience improvements first, followed by performance optimization. Key decisions were made about resource allocation and timeline adjustments.',
      chunksPath: '/chunks/audio_1',
      summary: 'Discussion about Q4 product roadmap, feature priorities, and resource allocation. Team decided to prioritize user experience improvements.',
      duration: 1800
    },
    {
      id: 'audio_2',
      filename: 'client_call_acme.mp3',
      originalName: 'client_call_acme.mp3',
      mimeType: 'audio/mpeg',
      size: 890000,
      path: '/recordings/audio/client_call_acme.mp3',
      fileStatus: 'processed',
      transcriptionStatus: 'completed',
      summaryStatus: 'completed',
      createdAt: new Date('2024-01-16T14:00:00Z'),
      updatedAt: new Date('2024-01-16T15:00:00Z'),
      transcript: 'Client discussion about new feature requirements and integration timeline. The client provided feedback on the current prototype and requested additional reporting capabilities.',
      chunksPath: '/chunks/audio_2',
      summary: 'Client feedback session on new features and integration requirements.',
      duration: 1200
    }
  ],
  videoRecordings: [
    {
      id: 'video_1',
      filename: 'product_demo_2024.mp4',
      originalName: 'product_demo_2024.mp4',
      mimeType: 'video/mp4',
      size: 5120000,
      path: '/recordings/video/product_demo_2024.mp4',
      fileStatus: 'processed',
      transcriptionStatus: 'completed',
      summaryStatus: 'completed',
      summary: 'Product demo showing new features and capabilities for stakeholders.',
      createdAt: new Date('2024-01-16T14:00:00Z'),
      updatedAt: new Date('2024-01-16T15:30:00Z'),
      thumbnail: '/thumbnails/video_1.jpg',
      duration: 2400
    }
  ]
};

// --- API Functions ---
async function getUserRecordings(accessToken: string) {
  try {
    console.log('Fetching recordings from CapMeet API...');
    
    // For now, return sample data - replace with actual API call when ready
    // const response = await fetch('https://api.capmeet.ai/recordings/my-recordings', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AUTH_TOKEN || accessToken}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API responded with ${response.status}`);
    // }
    // return await response.json();
    
    // Return sample data for testing
    return sampleRecordings;
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return sampleRecordings; // Fallback to sample data
  }
}

async function globalSearch(accessToken: string, search: string, type?: string, date?: string) {
  try {
    console.log(`Searching recordings for: "${search}", type: ${type}, date: ${date}`);
    
    // Mock search implementation
    const results = {
      recordings: [] as any[],
      transcripts: [] as any[]
    };

    // Search in audio recordings
    sampleRecordings.audioRecordings.forEach(recording => {
      if (recording.transcript?.toLowerCase().includes(search.toLowerCase()) ||
          recording.summary?.toLowerCase().includes(search.toLowerCase()) ||
          recording.originalName?.toLowerCase().includes(search.toLowerCase())) {
        results.recordings.push({
          ...recording,
          type: 'audio'
        });
        
        if (recording.transcript) {
          results.transcripts.push({
            recordingId: recording.id,
            text: recording.transcript,
            highlights: [search]
          });
        }
      }
    });

    // Search in video recordings
    sampleRecordings.videoRecordings.forEach(recording => {
      if (recording.summary?.toLowerCase().includes(search.toLowerCase()) ||
          recording.originalName?.toLowerCase().includes(search.toLowerCase())) {
        results.recordings.push({
          ...recording,
          type: 'video'
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error searching recordings:', error);
    return { recordings: [], transcripts: [] };
  }
}

async function getGoogleCalendarEvents(accessToken: string) {
  return sampleMeetings;
}

// --- Formatting Functions ---
function formatMeetingCard(meeting: any, index: number): string {
  const startDate = new Date(meeting.start.dateTime);
  const endDate = new Date(meeting.end.dateTime);
  const timeStr = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  
  const selfAttendee = meeting.attendees?.find((a: any) => a.self);
  let statusEmoji = '✅';
  let statusText = 'Accepted';
  if (selfAttendee) {
    if (selfAttendee.responseStatus === 'tentative') {
      statusEmoji = '❓';
      statusText = 'Tentative';
    } else if (selfAttendee.responseStatus === 'needsAction') {
      statusEmoji = '⏳';
      statusText = 'Needs Response';
    }
  }
  
  let card = `### ${meeting.summary}\n\n`;
  card += `**⏰ Time:** ${timeStr}\n`;
  card += `**${statusEmoji} Status:** ${statusText}\n`;
  
  if (meeting.location) {
    card += `**📍 Location:** ${meeting.location}\n`;
  }
  
  if (meeting.description) {
    card += `**📝 Description:** ${meeting.description}\n`;
  }
  
  if (meeting.organizer) {
    card += `**👤 Organizer:** ${meeting.organizer.displayName || meeting.organizer.email}\n`;
  }
  
  card += '\n---\n\n';
  return card;
}

function formatRecordingCard(recording: any, type: 'audio' | 'video'): string {
  const emoji = type === 'audio' ? '🎵' : '🎥';
  const duration = recording.duration ? `${Math.round(recording.duration / 60)} min` : 'Unknown';
  
  let card = `### ${emoji} ${recording.originalName || recording.filename}\n\n`;
  card += `**📊 Type:** ${type === 'audio' ? 'Audio' : 'Video'}\n`;
  card += `**⏱️ Duration:** ${duration}\n`;
  card += `**📅 Recorded:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
  card += `**📝 Status:** ${recording.transcriptionStatus}\n`;
  
  if (recording.summary) {
    card += `**📋 Summary:** ${recording.summary}\n`;
  }
  
  if (recording.transcript && recording.transcript.length > 0) {
    const preview = recording.transcript.length > 150 
      ? recording.transcript.substring(0, 150) + '...' 
      : recording.transcript;
    card += `**💬 Transcript Preview:** ${preview}\n`;
  }
  
  card += '\n---\n\n';
  return card;
}

// --- JSON-RPC 2.0 Helpers ---
function jsonRpcSuccess(id: any, result: any) {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

function jsonRpcError(id: any, code: number, message: string, data?: any) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data && { data })
    }
  };
}

// --- MCP SSE Endpoint (Critical for ChatGPT) ---
app.get('/mcp', (req: Request, res: Response) => {
  console.log('SSE connection requested from:', req.headers.origin);
  console.log('SSE Headers:', req.headers);
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Headers': 'Cache-Control,Content-Type,Authorization,Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Send server/ready event immediately (MCP requirement)
  const readyEvent = {
    jsonrpc: '2.0',
    method: 'server/ready',
    params: {
      serverInfo: {
        name: 'capmeet-recordings-server',
        version: '1.0.0'
      }
    }
  };

  console.log('Sending server/ready event');
  res.write(`data: ${JSON.stringify(readyEvent)}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    if (!res.writableEnded) {
      res.write(':keepalive\n\n');
    }
  }, 30000);

  // Handle connection close
  req.on('close', () => {
    console.log('SSE connection closed by client');
    clearInterval(keepAlive);
    if (!res.writableEnded) {
      res.end();
    }
  });

  req.on('error', (err) => {
    console.error('SSE connection error:', err);
    clearInterval(keepAlive);
  });
});

// --- MCP JSON-RPC Endpoint ---
app.post('/mcp', async (req: Request, res: Response) => {
  console.log('MCP JSON-RPC request received:', req.method, req.url);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { jsonrpc, method, id, params } = req.body;

  if (jsonrpc !== '2.0') {
    console.error('Invalid JSON-RPC version:', jsonrpc);
    return res.status(400).json(jsonRpcError(id, -32600, 'Invalid Request: JSON-RPC 2.0 required'));
  }

  try {
    switch (method) {
      case 'initialize': {
        console.log('Processing initialize request');
        const response = jsonRpcSuccess(id, {
          protocolVersion: '2025-03-26',
          capabilities: {
            roots: {},
            sampling: {}
          },
          serverInfo: {
            name: 'capmeet-recordings-server',
            version: '1.0.0'
          }
        });
        console.log('Sending initialize response');
        return res.json(response);
      }

      case 'tools/list': {
        console.log('Processing tools/list request');
        const response = jsonRpcSuccess(id, {
          tools: [
            {
              name: 'getMeetings',
              description: 'Retrieves upcoming meetings and calendar events. Use when user asks about schedule, meetings, appointments, or calendar.',
              inputSchema: {
                type: 'object',
                properties: {
                  maxResults: {
                    type: 'number',
                    description: 'Maximum number of meetings to return',
                    default: 10
                  }
                }
              }
            },
            {
              name: 'getRecordings',
              description: 'Retrieves user\'s audio and video recordings with transcripts and summaries. Use when user asks about recordings, past meetings, stored media files, or meeting history.',
              inputSchema: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    description: 'Filter by recording type',
                    enum: ['audio', 'video', 'all'],
                    default: 'all'
                  },
                  limit: {
                    type: 'number',
                    description: 'Maximum number of recordings to return',
                    default: 20
                  }
                }
              }
            },
            {
              name: 'searchRecordings',
              description: 'Search through recordings and transcripts for specific content. Use when user wants to find recordings by topic, keywords, date, or specific phrases mentioned in transcripts.',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search keywords or phrases to look for',
                    required: true
                  },
                  type: {
                    type: 'string',
                    description: 'Filter by media type',
                    enum: ['audio', 'video', 'all'],
                    default: 'all'
                  },
                  date: {
                    type: 'string',
                    description: 'Filter by date (YYYY-MM-DD) or relative time like "last week"'
                  }
                },
                required: ['query']
              }
            }
          ]
        });
        return res.json(response);
      }

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        console.log(`Processing tools/call: ${name}`, args);

        if (!name) {
          return res.json(jsonRpcError(id, -32602, 'Invalid params: tool name required'));
        }

        const accessToken = req.headers.authorization?.split(' ')[1] || '';

        switch (name) {
          case 'getMeetings': {
            const maxResults = args?.maxResults || 10;
            const allMeetings = await getGoogleCalendarEvents(accessToken);
            const meetings = allMeetings.slice(0, maxResults);
            
            let formattedText = '# 📅 Your Upcoming Meetings\n\n';
            
            if (meetings.length === 0) {
              formattedText += 'No upcoming meetings found.\n\n';
            } else {
              meetings.forEach((meeting: any, index: number) => {
                formattedText += formatMeetingCard(meeting, index + 1);
              });
            }
            
            formattedText += `\n---\n`;
            formattedText += `📊 **Total Meetings:** ${meetings.length}\n`;

            const response = jsonRpcSuccess(id, {
              content: [
                { 
                  type: 'text',
                  text: formattedText
                }
              ]
            });
            return res.json(response);
          }

          case 'getRecordings': {
            const type = args?.type || 'all';
            const limit = args?.limit || 20;
            
            const recordings = await getUserRecordings(accessToken);
            
            let formattedText = '# 🎵 Your Recordings\n\n';
            
            let audioRecordings = recordings.audioRecordings || [];
            let videoRecordings = recordings.videoRecordings || [];
            
            if (type === 'audio') {
              videoRecordings = [];
            } else if (type === 'video') {
              audioRecordings = [];
            }
            
            audioRecordings = audioRecordings.slice(0, limit);
            videoRecordings = videoRecordings.slice(0, limit);
            
            if (audioRecordings.length > 0) {
              formattedText += '## 🎧 Audio Recordings\n\n';
              audioRecordings.forEach((recording: any) => {
                formattedText += formatRecordingCard(recording, 'audio');
              });
            }
            
            if (videoRecordings.length > 0) {
              formattedText += '## 🎥 Video Recordings\n\n';
              videoRecordings.forEach((recording: any) => {
                formattedText += formatRecordingCard(recording, 'video');
              });
            }
            
            if (audioRecordings.length === 0 && videoRecordings.length === 0) {
              formattedText += 'No recordings found.\n\n';
            }
            
            formattedText += `\n---\n`;
            formattedText += `📊 **Total Recordings:** ${audioRecordings.length + videoRecordings.length}\n`;
            formattedText += `🎧 **Audio:** ${audioRecordings.length} | 🎥 **Video:** ${videoRecordings.length}\n`;

            const response = jsonRpcSuccess(id, {
              content: [
                { 
                  type: 'text',
                  text: formattedText
                }
              ]
            });
            return res.json(response);
          }

          case 'searchRecordings': {
            const query = args?.query;
            const type = args?.type || 'all';
            const date = args?.date;
            
            if (!query || query.trim().length === 0) {
              return res.json(jsonRpcError(id, -32602, 'Invalid params: search query is required'));
            }

            const searchResults = await globalSearch(accessToken, query, type, date);
            
            let formattedText = `# 🔍 Search Results for "${query}"\n\n`;
            
            if (searchResults.recordings.length === 0 && searchResults.transcripts.length === 0) {
              formattedText += 'No results found for your search query.\n\n';
              formattedText += '💡 *Try different keywords or broaden your search.*\n';
            } else {
              if (searchResults.recordings.length > 0) {
                formattedText += `## 📁 Matching Recordings (${searchResults.recordings.length})\n\n`;
                searchResults.recordings.forEach((recording: any, index: number) => {
                  formattedText += `### ${index + 1}. ${recording.type === 'audio' ? '🎵' : '🎥'} ${recording.originalName || recording.filename}\n`;
                  formattedText += `**📅 Date:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
                  if (recording.summary) {
                    formattedText += `**📋 Summary:** ${recording.summary}\n`;
                  }
                  formattedText += `**⏱️ Duration:** ${recording.duration ? Math.round(recording.duration / 60) + ' min' : 'Unknown'}\n\n`;
                });
              }
              
              if (searchResults.transcripts.length > 0) {
                formattedText += `## 💬 Matching Transcripts (${searchResults.transcripts.length})\n\n`;
                searchResults.transcripts.forEach((transcript: any, index: number) => {
                  formattedText += `### Excerpt ${index + 1}\n`;
                  formattedText += `**📁 From:** ${transcript.recordingId}\n`;
                  formattedText += `**📝 Text:** ${transcript.text}\n`;
                  if (transcript.highlights && transcript.highlights.length > 0) {
                    formattedText += `**🔍 Keywords:** ${transcript.highlights.join(', ')}\n`;
                  }
                  formattedText += '\n---\n\n';
                });
              }
            }
            
            formattedText += `\n---\n`;
            formattedText += `📊 **Found:** ${searchResults.recordings.length} recordings, ${searchResults.transcripts.length} transcript matches\n`;

            const response = jsonRpcSuccess(id, {
              content: [
                { 
                  type: 'text',
                  text: formattedText
                }
              ]
            });
            return res.json(response);
          }

          default:
            console.error(`Unknown tool: ${name}`);
            return res.json(jsonRpcError(id, -32601, `Unknown tool: ${name}`));
        }
      }

      case 'notifications/initialized': {
        console.log('Notifications initialized');
        return res.status(204).end();
      }

      case 'ping': {
        console.log('Ping received');
        return res.json(jsonRpcSuccess(id, { 
          status: 'ok',
          timestamp: new Date().toISOString()
        }));
      }

      default:
        console.error(`Method not found: ${method}`);
        return res.json(jsonRpcError(id, -32601, `Method not found: ${method}`));
    }
  } catch (error) {
    console.error('Error handling JSON-RPC request:', error);
    return res.json(jsonRpcError(
      id, 
      -32603, 
      'Internal error',
      error instanceof Error ? error.message : 'Unknown error'
    ));
  }
});

// --- Additional API Endpoints ---
app.get('/api/recordings', async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] || '';
    const recordings = await getUserRecordings(accessToken);
    res.json({
      success: true,
      data: recordings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'CapMeet MCP Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CapMeet MCP Server is running correctly',
    timestamp: new Date().toISOString(),
    endpoints: {
      mcp: {
        sse: 'GET /mcp',
        jsonrpc: 'POST /mcp'
      },
      api: {
        recordings: 'GET /api/recordings',
        health: 'GET /health'
      }
    }
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'CapMeet MCP Server',
    description: 'MCP server for accessing meetings and recordings',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    documentation: {
      mcp_protocol: 'https://spec.modelcontextprotocol.io/specification/'
    }
  });
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: IS_PRODUCTION ? 'Something went wrong' : error.message
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CapMeet MCP Server running on port ${PORT}`);
  console.log(`📍 MCP Endpoint: http://localhost:${PORT}/mcp`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test Endpoint: http://localhost:${PORT}/test`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Protocol: MCP (JSON-RPC 2.0 + SSE)`);
});

export default app;