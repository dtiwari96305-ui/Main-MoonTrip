import base64
import os

def main():
    logo_path = 'TOURIDOO.png'
    target_path = 'src/shared/utils/branding.js'
    
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        return
        
    with open(logo_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
        
    content = f'export const LOGO_BASE64 = "data:image/png;base64,{b64}";\n'
    
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully wrote {target_path}")

if __name__ == '__main__':
    main()
