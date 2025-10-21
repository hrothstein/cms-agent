import dotenv from 'dotenv';
import { MCPService } from './src/services/mcp.service';

// Load environment variables
dotenv.config();

async function listTools() {
  const mcp = new MCPService();
  
  try {
    console.log('Connecting to MCP server...');
    await mcp.connect();
    console.log('✓ Connected\n');
    
    console.log('Available MCP Tools:');
    console.log('='.repeat(80));
    
    const tools = await mcp.listTools();
    console.log(JSON.stringify(tools, null, 2));
    
    await mcp.disconnect();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

listTools();

