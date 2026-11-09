import { Client } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const outDir = '/Users/lixing/WorkRep/TodoList/PPT/voyah-skill-eval/ground-truth/html';
const fileName = 'icon.html';
const filePath = `${outDir}/${fileName}`;
const fileId = '192726801132881';
const layerId = '2:911';
const warmCount = Number(process.argv[2] || 120);
const codeFile = process.env.CODE_FILE || filePath;
const code = await readFile(codeFile, 'utf8');
const unresolved = [...new Set([...code.matchAll(/@@SVG:S(\d+)#/g)].map(match => Number(match[1])))].sort((a, b) => a - b);
console.log(`Unresolved sections in current HTML: ${unresolved.length}; warming first ${warmCount}`);
const batch = unresolved.slice(0, warmCount);
const ps = execSync('ps -eo command', { encoding: 'utf8' });
const token = ps.match(/mastergo-magic-mcp --token=([^ ]+)/)?.[1];
if (!token) throw new Error('MasterGo MCP token not found');
const transport = new StdioClientTransport({ command: 'node', args: ['/Users/lixing/.npm/_npx/7c54131f45379e40/node_modules/@mastergo/magic-mcp/dist/index.js', `--token=${token}`, '--url=https://mastergo.com'] });
const client = new Client({ name: 'icon-warm-apply', version: '1.0.0' });
await client.connect(transport);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let cursor = 0;
let lastStart = 0;
const failed = [];
async function worker() {
  while (true) {
    const position = cursor++;
    if (position >= batch.length) return;
    const index = batch[position];
    const wait = Math.max(0, 1200 - (Date.now() - lastStart));
    if (wait) await sleep(wait);
    lastStart = Date.now();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await client.callTool({ name: 'mcp__getDesignSections', arguments: { fileId, layerId, sectionIndex: index, format: 'tree' } });
        const text = response.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || '';
        if (!text.includes(`sectionIndex: ${index}`) || !text.includes('tree:')) throw new Error(`Invalid section payload: ${text.slice(0, 200)}`);
        break;
      } catch (error) {
        const message = String(error?.message || error);
        if (message.includes('10001') && attempt < 2) {
          console.log(`Rate limit on ${index}; sleeping 30s before retry`);
          await sleep(30000);
        } else if (attempt === 1) {
          failed.push({ index, error: message });
        }
      }
    }
    if ((position + 1) % 20 === 0) console.log(`Warmed ${position + 1}/${batch.length}`);
  }
}
await Promise.all(Array.from({ length: 2 }, worker));
if (failed.length) {
  console.error(JSON.stringify({ failed }, null, 2));
  process.exitCode = 1;
} else {
  let result;
  for (let attempt = 0; attempt < 2; attempt++) {
    result = await client.callTool({
      name: 'mcp__applyDesign',
      arguments: { code, fileId, layerId, outDir, outputFileName: fileName, targetLang: 'html' }
    }, undefined, { timeout: 600000 });
    const resultText = result.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || JSON.stringify(result);
    if (!result.isError || !resultText.includes('10019') || attempt === 1) break;
    console.log('applyDesign returned 10019; sleeping 30s before one retry');
    await sleep(30000);
  }
  const text = result.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || JSON.stringify(result);
  const summary = text.length > 1200 ? `${text.slice(0, 1200)}... [truncated]` : text;
  console.log(`applyDesign result:\n${summary}`);
  if (result.isError) process.exitCode = 1;
}
await client.close();
