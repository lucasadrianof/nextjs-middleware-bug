import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../.next/standalone/node_modules/next/dist/server/body-streams.js');

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add the delay before replaceRequestBody call
  const searchString = 'replaceRequestBody(readable, buffered);';
  const replacement = `await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));\n                replaceRequestBody(readable, buffered);`;

  if (content.includes(searchString)) {
    content = content.replace(searchString, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Successfully patched body-streams.js');
  } else {
    console.warn('⚠ Could not find the target line in body-streams.js');
  }
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('✗ Error patching body-streams.js:', errorMessage);
  process.exit(1);
}
