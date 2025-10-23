import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ... (existing middleware and sample meetings data remains the same)

// --- Recordings API Integration ---

// Mock recordings data (replace with your actual API calls)
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
      transcript: 'In today\'s meeting we discussed the Q4 roadmap and feature priorities...',
      chunksPath: '/chunks/audio_1',
      summary: 'Discussion about Q4 product roadmap, feature priorities, and resource allocation.',
      duration: 1800
    }
  ],
  videoRecordings: [
    {
      id: 'video_1',
      filename: 'client_demo_2024.mp4',
      originalName: 'client_demo_2024.mp4',
      mimeType: 'video/mp4',
      size: 5120000,
      path: '/recordings/video/client_demo_2024.mp4',
      fileStatus: 'processed',
      transcriptionStatus: 'completed',
      summaryStatus: 'completed',
      summary: 'Product demo for Acme Corporation showing new features and capabilities.',
      createdAt: new Date('2024-01-16T14:00:00Z'),
      updatedAt: new Date('2024-01-16T15:30:00Z'),
      thumbnail: '/thumbnails/video_1.jpg',
      duration: 2400
    }
  ]
};

// Function to call your recordings API
async function getUserRecordings(accessToken: string) {
  // Replace this with actual API call to your recordings service
  try {
    // Example of calling your API:
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); 
    const response = await fetch('https://api.capmeet.ai/recordings/my-recordings', {
      headers: {
        'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
     if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    return await response.json();
    
    // For now, return mock data
   // return sampleRecordings;
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return error; // Fallback to sample data
  }
}

// Function to call your global search API
async function globalSearch(accessToken: string, search: string, type?: string, date?: string) {
  // Replace this with actual API call to your search service
  try {
    // Example:
    // const params = new URLSearchParams();
    // if (search) params.append('search', search);
    // if (type) params.append('type', type);
    // if (date) params.append('date', date);
    
    // const response = await fetch(`YOUR_SEARCH_API_URL/search?${params}`, {
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return await response.json();
    
    // Mock search results
    return {
      recordings: [
        {
          id: 'audio_1',
          type: 'audio',
          filename: 'team_meeting_2024.mp3',
          summary: 'Discussion about Q4 product roadmap...',
          createdAt: new Date('2024-01-15T10:00:00Z'),
          duration: 1800
        }
      ],
      transcripts: [
        {
          recordingId: 'audio_1',
          text: 'In today\'s meeting we discussed the Q4 roadmap...',
          highlights: ['Q4 roadmap', 'feature priorities']
        }
      ]
    };
  } catch (error) {
    console.error('Error searching recordings:', error);
    return { recordings: [], transcripts: [] };
  }
}

// ... (existing utility functions remain the same)

// Format recording card for display
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
  
  if (recording.transcript) {
    const preview = recording.transcript.length > 150 
      ? recording.transcript.substring(0, 150) + '...' 
      : recording.transcript;
    card += `**💬 Transcript Preview:** ${preview}\n`;
  }
  
  card += '\n---\n\n';
  return card;
}

// --- JSON-RPC 2.0 Response Helper ---
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
// Update the MCP JSON-RPC Handler to include recordings tools
app.post('/mcp', async (req: Request, res: Response) => {
  const { jsonrpc, method, id, params } = req.body;

  if (jsonrpc !== '2.0') {
    return res.status(400).json(jsonRpcError(id, -32600, 'Invalid Request'));
  }

  try {
    switch (method) {
      case 'initialize': {
        const response = jsonRpcSuccess(id, {
          protocolVersion: '2025-03-26',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'meetings-recordings-mcp-server',
            version: '1.0.0'
          }
        });
        return res.json(response);
      }

      case 'tools/list': {
        const response = jsonRpcSuccess(id, {
          tools: [
            // Existing meeting tools...
            {
              name: 'getMeetings',
              description: 'Retrieves upcoming meetings and calendar events.',
              // ... existing meeting tool config
            },
            {
              name: 'summarizeMeeting',
              description: 'Generates a comprehensive AI-powered summary from meeting transcripts.',
              // ... existing meeting tool config
            },
            // NEW RECORDINGS TOOLS
            {
              name: 'getRecordings',
              description: 'Retrieves user\'s audio and video recordings with transcripts and summaries. Use when user asks about their recordings, past meetings, or stored media files.',
              inputSchema: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    description: 'Filter by type: "audio", "video", or "all"',
                    enum: ['audio', 'video', 'all'],
                    default: 'all'
                  },
                  limit: {
                    type: 'number',
                    description: 'Maximum number of recordings to return',
                    default: 20
                  }
                }
              },
              metadata: {
                invokingMessage: 'Fetching your recordings...',
                invokedMessage: 'Found your recordings!',
                outputTemplate: 'ui://widget/recordings-list.html'
              }
            },
            {
              name: 'searchRecordings',
              description: 'Search through recordings and transcripts for specific content. Use when user wants to find recordings by topic, date, or specific keywords mentioned in transcripts.',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query - keywords, topics, or phrases to search for',
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
                    description: 'Filter by date (YYYY-MM-DD) or relative time like "last week", "this month"'
                  }
                },
                required: ['query']
              },
              metadata: {
                invokingMessage: 'Searching your recordings...',
                invokedMessage: 'Search complete!',
                outputTemplate: 'ui://widget/search-results.html'
              }
            }
          ]
        });
        return res.json(response);
      }

      case 'tools/call': {
        const { name, arguments: args } = params || {};

        if (!name) {
          return res.json(jsonRpcError(id, -32602, 'Invalid params: tool name required'));
        }

        switch (name) {
          case 'getMeetings': {
            // ... existing meetings code
          }

          case 'summarizeMeeting': {
            // ... existing summarize code
          }

          // NEW RECORDINGS TOOL IMPLEMENTATION
          case 'getRecordings': {
            const accessToken = req.headers.authorization?.split(' ')[1] || '';
            const type = args?.type || 'all';
            const limit = args?.limit || 20;
            
            const recordings = await getUserRecordings(accessToken);
            
            let formattedText = '# 🎵 Your Recordings\n\n';
            
            // Filter by type if specified
            let audioRecordings = recordings.audioRecordings || [];
            let videoRecordings = recordings.videoRecordings || [];
            
            if (type === 'audio') {
              videoRecordings = [];
            } else if (type === 'video') {
              audioRecordings = [];
            }
            
            // Apply limit
            audioRecordings = audioRecordings.slice(0, limit);
            videoRecordings = videoRecordings.slice(0, limit);
            
            if (audioRecordings.length > 0) {
              formattedText += '## 🎧 Audio Recordings\n\n';
              audioRecordings.forEach((recording: any, index: number) => {
                formattedText += formatRecordingCard(recording, 'audio');
              });
            }
            
            if (videoRecordings.length > 0) {
              formattedText += '## 🎥 Video Recordings\n\n';
              videoRecordings.forEach((recording: any, index: number) => {
                formattedText += formatRecordingCard(recording, 'video');
              });
            }
            
            if (audioRecordings.length === 0 && videoRecordings.length === 0) {
              formattedText += 'No recordings found.\n\n';
            }
            
            formattedText += `\n---\n\n`;
            formattedText += `📊 **Total:** ${audioRecordings.length + videoRecordings.length} recordings | `;
            formattedText += `🎧 **Audio:** ${audioRecordings.length} | `;
            formattedText += `🎥 **Video:** ${videoRecordings.length}\n\n`;
            formattedText += `💡 *Tip: Use "searchRecordings" to find specific content in your recordings!*`;

            const response = jsonRpcSuccess(id, {
              content: [
                { 
                  type: 'text',
                  text: formattedText
                }
              ],
              metadata: {
                status: 'success',
                totalRecordings: audioRecordings.length + videoRecordings.length,
                audioCount: audioRecordings.length,
                videoCount: videoRecordings.length
              }
            });
            return res.json(response);
          }

          case 'searchRecordings': {
            const accessToken = req.headers.authorization?.split(' ')[1] || '';
            const query = args?.query;
            const type = args?.type || 'all';
            const date = args?.date;
            
            if (!query) {
              return res.json(jsonRpcError(id, -32602, 'Invalid params: search query required'));
            }

            const searchResults = await globalSearch(accessToken, query, type, date);
            
            let formattedText = `# 🔍 Search Results for "${query}"\n\n`;
            
            if (searchResults.recordings.length === 0 && searchResults.transcripts.length === 0) {
              formattedText += 'No results found for your search query.\n\n';
            } else {
              if (searchResults.recordings.length > 0) {
                formattedText += '## 📁 Matching Recordings\n\n';
                searchResults.recordings.forEach((recording: any) => {
                  formattedText += `### ${recording.type === 'audio' ? '🎵' : '🎥'} ${recording.filename}\n`;
                  formattedText += `**📅 Date:** ${new Date(recording.createdAt).toLocaleDateString()}\n`;
                  if (recording.summary) {
                    formattedText += `**📋 Summary:** ${recording.summary}\n`;
                  }
                  formattedText += `**⏱️ Duration:** ${recording.duration ? Math.round(recording.duration / 60) + ' min' : 'Unknown'}\n\n`;
                });
              }
              
              if (searchResults.transcripts.length > 0) {
                formattedText += '## 💬 Matching Transcripts\n\n';
                searchResults.transcripts.forEach((transcript: any, index: number) => {
                  formattedText += `### Result ${index + 1}\n`;
                  formattedText += `**📁 Recording:** ${transcript.recordingId}\n`;
                  formattedText += `**📝 Excerpt:** ${transcript.text}\n`;
                  if (transcript.highlights && transcript.highlights.length > 0) {
                    formattedText += `**🔍 Keywords:** ${transcript.highlights.join(', ')}\n`;
                  }
                  formattedText += '\n---\n\n';
                });
              }
            }
            
            formattedText += `\n---\n\n`;
            formattedText += `📊 **Found:** ${searchResults.recordings.length} recordings, ${searchResults.transcripts.length} transcript matches\n\n`;

            const response = jsonRpcSuccess(id, {
              content: [
                { 
                  type: 'text',
                  text: formattedText
                }
              ],
              metadata: {
                status: 'success',
                query: query,
                recordingsFound: searchResults.recordings.length,
                transcriptsFound: searchResults.transcripts.length
              }
            });
            return res.json(response);
          }

          default:
            return res.json(jsonRpcError(id, -32601, `Unknown tool: ${name}`));
        }
      }

      // ... rest of the existing methods remain the same
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

// ... rest of the existing server code (SSE, dashboard, etc.) remains the same

// Add recordings API endpoint
app.get('/api/recordings', async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1] || '';
  const recordings = await getUserRecordings(accessToken);
  res.json(recordings);
});

// Update dashboard to include recordings
app.get('/dashboard', (req: Request, res: Response) => {
  // Update the HTML to include recordings section
  // Add tabs or sections for recordings in the dashboard
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meetings & Recordings MCP Server</title>
        <style>
            /* Add recordings-specific styles */
            .recordings-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .tab-container {
                margin-bottom: 24px;
            }
            .tab-buttons {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }
            .tab-button {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                background: #e2e8f0;
                color: #4a5568;
                cursor: pointer;
                font-weight: 500;
            }
            .tab-button.active {
                background: #667eea;
                color: white;
            }
            .tab-content {
                display: none;
            }
            .tab-content.active {
                display: block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🗓️ Meetings & Recordings Dashboard</h1>
                <p>MCP Server for ChatGPT - Manage meetings and recordings</p>
            </div>

            <div class="tab-container">
                <div class="tab-buttons">
                    <button class="tab-button active" onclick="showTab('meetings')">Meetings</button>
                    <button class="tab-button" onclick="showTab('recordings')">Recordings</button>
                </div>
                
                <div id="meetings-tab" class="tab-content active">
                    <!-- Existing meetings content -->
                    <div class="stats">
                        <!-- meetings stats -->
                    </div>
                    <div class="meetings-grid" id="meetingsContainer"></div>
                </div>
                
                <div id="recordings-tab" class="tab-content">
                    <div class="recordings-stats">
                        <div class="stat-card">
                            <div class="stat-value" id="totalRecordings">0</div>
                            <div class="stat-label">Total Recordings</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="audioRecordings">0</div>
                            <div class="stat-label">Audio</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="videoRecordings">0</div>
                            <div class="stat-label">Video</div>
                        </div>
                        <div class="stat-card">
                            <button class="refresh-btn" onclick="loadRecordings()">🔄 Refresh</button>
                        </div>
                    </div>
                    <div id="recordingsContainer"></div>
                    <div id="videoRecordingsContainer"></div>
                </div>
            </div>
        </div>

        <script>
            function showTab(tabName) {
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Show selected tab
                document.getElementById(tabName + '-tab').classList.add('active');
                event.target.classList.add('active');
            }

            async function loadRecordings() {
                try {
                    const response = await fetch('/api/recordings');
                    const recordings = await response.json();
                    
                    document.getElementById('totalRecordings').textContent = 
                        recordings.audioRecordings.length + recordings.videoRecordings.length;
                    document.getElementById('audioRecordings').textContent = recordings.audioRecordings.length;
                    document.getElementById('videoRecordings').textContent = recordings.videoRecordings.length;
                    
                    // Render recordings in the container
                    const container = document.getElementById('recordingsContainer');
                    // Add your recordings rendering logic here
                    container.innerHTML = '';
                    recordings.audioRecordings.forEach(recording => {
                        const div = document.createElement('div');
                        div.className = 'recording';
                        
                        const title = document.createElement('h3');
                        title.textContent = recording.filename || 'Untitled Recording';
                        
                        const mimeType = document.createElement('p');
                        mimeType.textContent = 'Type: ' + (recording.mimeType || 'N/A');
                        
                        const date = document.createElement('p');
                        date.textContent = 'Created: ' + (recording.created_at ? new Date(recording.created_at).toLocaleString() : 'Date not available');
                        
                        const transcript = document.createElement('p');
                        transcript.textContent = recording.transcript || 'No transcript available';
                        
                        div.appendChild(title);
                        div.appendChild(mimeType);
                        div.appendChild(date);
                        div.appendChild(transcript);
                        container.appendChild(div);
                    });
                } catch (error) {
                    console.error('Error loading recordings:', error);
                }
            }

            // Load initial data
            loadMeetings();
            loadRecordings();
        </script>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`📍 MCP Endpoint: http://localhost:${PORT}/mcp`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🎵 Recordings API: http://localhost:${PORT}/api/recordings`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

export default app;