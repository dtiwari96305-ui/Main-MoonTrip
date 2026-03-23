const fs = require('fs');

const files = [
  'src/shared/components/Header.jsx',
  'src/components/Header.jsx',
  'src/dashboard/components/RealHeader.jsx',
  'src/pages/Accounts.jsx',
  'src/pages/BookingDetail.jsx',
  'src/pages/CreateQuote.jsx',
  'src/pages/Payments.jsx',
  'src/pages/QuoteDesigner.jsx',
  'src/pages/Settings.jsx',
  'src/pages/SalesInvoices.jsx',
  'src/pages/QuoteDetail.jsx',
  'src/pages/Billing.jsx',
  'src/pages/CustomerProfile.jsx',
  'src/dashboard/pages/BookingDetail.jsx',
  'src/dashboard/pages/CreateQuote.jsx',
  'src/dashboard/pages/QuoteDetail.jsx',
  'src/dashboard/pages/CustomerProfile.jsx'
];

for (const f of files) {
  try {
    let content = fs.readFileSync(f, 'utf8');
    
    const startIdx = content.indexOf('const LogsPopup = ({ onClose }) => {');
    if (startIdx !== -1) {
      const endMatch = content.indexOf('};', content.indexOf('<p>No logs yet</p>')) + 2;
      if (endMatch > startIdx) {
        content = content.substring(0, startIdx) + content.substring(endMatch);
      }
    }

    const btnStart = content.indexOf('<div style={{ position: \'relative\' }}>\n');
    let targetStart = btnStart;
    if (targetStart === -1) {
      // In RealHeader.jsx, there might be different spacing
      targetStart = content.indexOf('<div style={{ position: \'relative\' }}>');
    }

    if (targetStart !== -1) {
      // Loop until we find the closing </div> that matches this div
      // Find the first </div>
      const blockEnd = content.indexOf('</div>', targetStart) + 6;
      
      const isDash = f.includes('dashboard/');
      let buttonComp = isDash ? '<RealLogButton />' : '<DemoLogButton />';
      
      content = content.substring(0, targetStart) + buttonComp + content.substring(blockEnd);

      // Clean up states
      content = content.replace(/const\s+\[isLogsOpen,\s*setIsLogsOpen\]\s*=\s*useState\(false\);\n?/g, '');
      content = content.replace(/const\s+unreadCount\s*=\s*useUnreadLogCount\(\);\n?/g, '');
      content = content.replace(/import\s*\{\s*RealLogsPopup.*?\s*\}\s*from\s*['"].*?RealLogsPopup['"];\n?/g, '');

      let importPath = '';
      if (f.includes('dashboard/pages')) importPath = "import { RealLogButton } from '../components/RealLogButton';\n";
      else if (f.includes('dashboard/components')) importPath = "import { RealLogButton } from './RealLogButton';\n";
      else if (f.includes('shared/components')) importPath = "import { DemoLogButton } from '../../demo/components/DemoLogButton';\n";
      else if (f.includes('components/')) importPath = "import { DemoLogButton } from '../demo/components/DemoLogButton';\n";
      else importPath = "import { DemoLogButton } from '../demo/components/DemoLogButton';\n";

      // If it's already there, skip adding import
      if (!content.includes(importPath.trim())) {
          content = content.replace(/(import React.*?;\n)/, `$1${importPath}`);
      }

      fs.writeFileSync(f, content);
      console.log('Fixed ' + f);
    } else {
      console.log('Could not find btn block in: ' + f);
    }
  } catch(e) {
    console.log('Failed ' + f + ': ' + e.message);
  }
}
