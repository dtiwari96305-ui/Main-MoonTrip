import os
import re

files = [
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
]

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Remove LogsPopup definition
    start = content.find('const LogsPopup = ({ onClose }) => {')
    if start != -1:
        end_str = '<p>No logs yet</p>'
        end_idx = content.find(end_str, start)
        if end_idx != -1:
            close_idx = content.find('};', end_idx) + 2
            content = content[:start] + content[close_idx:]

    # 2. Replace button block
    btn_start = content.find("<div style={{ position: 'relative' }}>\n")
    if btn_start == -1:
        btn_start = content.find("<div style={{ position: 'relative' }}>")
    if btn_start == -1:
        btn_start = content.find("<div style={{position: 'relative'}}>")

    if btn_start != -1:
        btn_end = content.find('</div>', btn_start) + 6
        
        button_comp = '<RealLogButton />' if 'dashboard/' in f else '<DemoLogButton />'
        content = content[:btn_start] + button_comp + content[btn_end:]

        # Cleanups
        content = re.sub(r'const \[isLogsOpen, setIsLogsOpen\] = useState\(false\);\n?', '', content)
        content = re.sub(r'const unreadCount = useUnreadLogCount\(\);\n?', '', content)
        content = re.sub(r"import \{ RealLogsPopup.*?\} from '.*?RealLogsPopup';\n?", '', content)

        import_path = ''
        if 'dashboard/pages' in f: import_path = "import { RealLogButton } from '../components/RealLogButton';\n"
        elif 'dashboard/components' in f: import_path = "import { RealLogButton } from './RealLogButton';\n"
        elif 'shared/components' in f: import_path = "import { DemoLogButton } from '../../demo/components/DemoLogButton';\n"
        elif 'components/' in f: import_path = "import { DemoLogButton } from '../demo/components/DemoLogButton';\n"
        else: import_path = "import { DemoLogButton } from '../demo/components/DemoLogButton';\n"

        if import_path.strip() not in content:
            content = re.sub(r'(import React.*?;?\n)', r'\1' + import_path, content, count=1)

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed {f}')
    else:
        print(f'Button block not found in {f}')
