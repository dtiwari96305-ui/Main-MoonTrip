const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const isRealDash = file.includes('dashboard');
  const buttonComp = isRealDash ? '<RealLogButton />' : '<DemoLogButton />';
  const buttonImport = isRealDash 
    ? "import { RealLogButton } from '../components/RealLogButton';" 
    : "import { DemoLogButton } from '../demo/components/DemoLogButton';";

  // Different relative paths based on depth
  const depth = (file.match(/\//g) || []).length;
  // src/dashboard/pages/X.jsx depth 3 => ../components
  // src/pages/X.jsx depth 2 => ../demo/components
  // src/shared/components/X.jsx depth 3 => ../../demo/components
  
  let actualImport = buttonImport;
  if (!isRealDash) {
    if (file.includes('shared/components')) actualImport = "import { DemoLogButton } from '../../demo/components/DemoLogButton';";
    else actualImport = "import { DemoLogButton } from '../demo/components/DemoLogButton';";
  } else {
      if (file.includes('dashboard/pages/')) actualImport = "import { RealLogButton } from '../components/RealLogButton';";
      else actualImport = "import { RealLogButton } from './RealLogButton';";
  }

  // 1. Remove inline LogsPopup definitions exactly mimicking the known one
  const inlinePopupRegex = /const LogsPopup = \(\{ onClose \}\) => \{[\s\S]*?className="logs-empty"[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\};/g;
  if (inlinePopupRegex.test(content)) {
    content = content.replace(inlinePopupRegex, '');
    changed = true;
  }

  // 2. Remove RealLogsPopup & useUnreadLogCount imports
  const realImportRegex = /import\s+\{\s*RealLogsPopup[\s\S]*?\}\s+from\s+['"].*?RealLogsPopup['"];/g;
  if (realImportRegex.test(content)) {
    content = content.replace(realImportRegex, '');
    changed = true;
  }

  // 3. Replace the button block
  // Pattern varies slightly but generally:
  // <div style={{ position: 'relative' }}>\n <button className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`} ...>...</button>\n {isLogsOpen && <LogsPopup ... />}\n </div>
  const btnBlockRegex = /<div\s+style=\{\{\s*position:\s*['"]relative['"]\s*\}\}\>[\s\S]*?log-btn[\s\S]*?isLogsOpen[\s\S]*?<\/div>/g;
  
  if (btnBlockRegex.test(content)) {
    content = content.replace(btnBlockRegex, buttonComp);
    
    // Add import right after the first import or react import
    if (!content.includes(buttonComp.match(/<(\w+)/)[1])) {
       content = content.replace(/(import React.*?;\n)/, `$1${actualImport}\n`);
    }
    
    // 4. Remove [isLogsOpen, setIsLogsOpen] useState
    const stateRegex = /const\s+\[isLogsOpen,\s*setIsLogsOpen\]\s*=\s*useState\(false\);[\r\n]*/g;
    content = content.replace(stateRegex, '');
    
    // 5. Remove unreadCount
    const unreadRegex = /const\s+unreadCount\s*=\s*useUnreadLogCount\(\);[\r\n]*/g;
    content = content.replace(unreadRegex, '');

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
