import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../.next/standalone/node_modules/next/dist/server/next-server.js');

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add await before requestData.body.finalize()
  const searchString = 'requestData.body.finalize();';
  const replacement = 'await requestData.body.finalize();';

  if (content.includes(searchString)) {
    content = content.replace(searchString, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Successfully applied bugfix to next-server.js');
  } else {
    console.warn('⚠ Could not find the target line in next-server.js');
  }
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('✗ Error applying bugfix to next-server.js:', errorMessage);
  process.exit(1);
}

