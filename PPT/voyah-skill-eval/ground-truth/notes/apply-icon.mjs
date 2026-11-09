import { Client } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const template = '/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth/notes/icon-template.html';
const outDir = '/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth/html';
const fileName = process.argv[2] || 'icon.html';
const fileId = '192726801132881';
const layerId = '2:911';
const code = await readFile(template, 'utf8');
const placeholders = (code.match(/@@SVG:[^@]+@@/g) || []).length;
if (!placeholders) throw new Error('No SVG placeholders in generated code');
const ps = execSync('ps -eo command', { encoding: 'utf8' });
const token = ps.match(/mastergo-magic-mcp --token=([^ ]+)/)?.[1];
if (!token) throw new Error('MasterGo MCP token not found');
const transport = new StdioClientTransport({ command: 'node', args: ['/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@mastergo/magic-mcp/dist/index.js', `--token=${token}`, '--url=https://mastergo.com'] });
const client = new Client({ name: 'icon-apply-design', version: '1.0.0' });
await client.connect(transport);
const result = await client.callTool({
  name: 'mcp__applyDesign',
  arguments: { code, fileId, layerId, outDir, outputFileName: fileName, targetLang: 'html' }
}, undefined, { timeout: 600000 });
const text = result.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || JSON.stringify(result);
console.log(`Submitted code with ${placeholders} placeholders; result:\n${text.slice(0, 5000)}`);
await client.close();
if (result.isError) process.exitCode = 1;
