import { Client } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const file = '/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth/notes/icon-sections.json';
const data = JSON.parse(await readFile(file, 'utf8'));
const missing = data.sections.map((text, index) => text ? -1 : index).filter(index => index >= 0);
const batch = missing.slice(0, 100);
console.log(`Starting resume batch: ${batch.length} of ${missing.length} missing sections`);
const ps = execSync('ps -eo command', { encoding: 'utf8' });
const token = ps.match(/mastergo-magic-mcp --token=([^ ]+)/)?.[1];
if (!token) throw new Error('MasterGo MCP token not found');
const transport = new StdioClientTransport({ command: 'node', args: ['/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@mastergo/magic-mcp/dist/index.js', `--token=${token}`, '--url=https://mastergo.com'] });
const client = new Client({ name: 'icon-section-resume', version: '1.0.0' });
await client.connect(transport);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let cursor = 0;
let lastStart = 0;
const errors = [];
async function worker() {
  while (true) {
    const position = cursor++;
    if (position >= batch.length) return;
    const index = batch[position];
    const wait = Math.max(0, 1200 - (Date.now() - lastStart));
    if (wait) await sleep(wait);
    lastStart = Date.now();
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await client.callTool({ name: 'mcp__getDesignSections', arguments: { fileId: data.fileId, layerId: data.layerId, sectionIndex: index, format: 'tree' } });
        const text = response.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || '';
        if (!text.includes(`sectionIndex: ${index}`) || !text.includes('tree:')) throw new Error(`Invalid section payload: ${text.slice(0, 200)}`);
        data.sections[index] = text;
        data.errors = data.errors.filter(item => item.sectionIndex !== index);
        lastError = null;
        break;
      } catch (error) {
        lastError = String(error?.message || error);
        if (lastError.includes('10001') && attempt < 2) {
          console.log(`Rate limit on ${index}; sleeping 30s before retry`);
          await sleep(30000);
        } else if (attempt === 0) {
          await sleep(1500);
        }
      }
    }
    if (lastError) errors.push({ sectionIndex: index, error: lastError });
    if ((position + 1) % 20 === 0) console.log(`Processed ${position + 1}/${batch.length}; errors=${errors.length}`);
  }
}
await Promise.all(Array.from({ length: 2 }, worker));
await writeFile(file, JSON.stringify(data, null, 2));
console.log(JSON.stringify({ batchCompleted: batch.length - errors.length, remaining: data.sections.filter(text => !text).length, errors }, null, 2));
await client.close();
