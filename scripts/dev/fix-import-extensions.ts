import fs from 'fs';
import path from 'path';

const targetExtensions = ['.ts', '.tsx', '.js', '.json'];
const rootDir = './'; // Adjust if needed

function walk(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, callback);
    } else if (/\.(ts|tsx|js)$/.test(file)) {
      callback(filePath);
    }
  });
}

function fixImports(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content.replace(/(from\s+['"]\.\/[^'"]+?)(?=['"])/g, (match, p1) => {
    for (const ext of targetExtensions) {
      if (fs.existsSync(path.resolve(path.dirname(filePath), p1.slice(6) + ext))) {
        return p1 + ext;
      }
    }
    return match; // leave untouched if no match found
  });

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Fixed imports in: ${filePath}`);
  }
}

walk(rootDir, fixImports);