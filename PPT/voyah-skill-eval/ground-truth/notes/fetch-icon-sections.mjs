import { Client } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const fileId = '192726801132881';
const layerId = '2:911';
const outFile = '/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth/notes/icon-sections.json';
const ps = execSync('ps -eo command', { encoding: 'utf8' });
const token = ps.match(/mastergo-magic-mcp --token=([^ ]+)/)?.[1];
if (!token) throw new Error('MasterGo MCP token not found in running process');
const transport = new StdioClientTransport({
  command: 'node',
  args: ['/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@mastergo/magic-mcp/dist/index.js', `--token=${token}`, '--url=https://mastergo.com'],
  stderr: 'pipe'
});
transport.stderr?.on('data', chunk => {
  const text = chunk.toString();
  if (/error|failed/i.test(text)) console.error(text.trim());
});
const client = new Client({ name: 'icon-section-fetcher', version: '1.0.0' });
await client.connect(transport);
const results = new Array(803);
const errors = [];
let next = 0;
let completed = 0;
async function worker() {
  while (true) {
    const index = next++;
    if (index >= results.length) return;
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.callTool({
          name: 'mcp__getDesignSections',
          arguments: { fileId, layerId, sectionIndex: index, format: 'tree' }
        });
        const text = response.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || '';
        if (!text.includes(`sectionIndex: ${index}`) || !text.includes('tree:')) throw new Error(`Invalid section payload: ${text.slice(0, 300)}`);
        results[index] = text;
        lastError = null;
        break;
      } catch (error) {
        lastError = String(error?.message || error);
      }
    }
    if (lastError) errors.push({ sectionIndex: index, error: lastError });
    completed++;
    if (completed % 25 === 0 || completed === results.length) console.log(`Fetched ${completed}/803; errors=${errors.length}`);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
await writeFile(outFile, JSON.stringify({ fileId, layerId, totalSections: 803, sections: results, errors }, null, 2));
console.log(JSON.stringify({ outFile, fetched: results.filter(Boolean).length, errors }, null, 2));
await client.close();
if (errors.length) process.exitCode = 1;
