import sys
import os
import json
from core import UIUXCore

def main():
    if len(sys.argv) < 2:
        print("Usage: python search.py <query>")
        sys.exit(1)
    
    query = " ".join(sys.argv[1:])
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    core = UIUXCore(data_dir)
    
    recommendation = core.get_recommendation(query)
    
    if not recommendation:
        print(f"No results found for '{query}'. Please try again with different keywords.")
        sys.exit(0)
    
    print(f"### UI/UX Strategy for: {recommendation['product'].get('Product Type', query)}")
    print(f"**Description:** {recommendation['product'].get('Key Considerations', '')}")
    print("\n#### 🎨 Visual Identity")
    print(f"- **Primary Style:** {recommendation['product'].get('Primary Style Recommendation', '')}")
    print(f"- **Secondary Styles:** {recommendation['product'].get('Secondary Styles', '')}")
    print(f"- **Key Considerations:** {recommendation['product'].get('Key Considerations', '')}")
    
    if recommendation['colors']:
        c = recommendation['colors']
        print(f"\n#### 🖌️ Color Palette")
        print(f"- **Primary:** `{c.get('Primary (Hex)', '')}`")
        print(f"- **Secondary:** `{c.get('Secondary (Hex)', '')}`")
        print(f"- **CTA:** `{c.get('CTA (Hex)', '')}`")
        print(f"- **Background:** `{c.get('Background (Hex)', '')}`")
        print(f"- **Text:** `{c.get('Text (Hex)', '')}`")
        print(f"- **Notes:** {c.get('Notes', '')}")

    if recommendation['typography']:
        t = recommendation['typography']
        print(f"\n#### 🔠 Typography Pairing")
        print(f"- **Pairing Name:** {t.get('Font Pairing Name', '')}")
        print(f"- **Heading Font:** {t.get('Heading Font', '')}")
        print(f"- **Body Font:** {t.get('Body Font', '')}")
        print(f"- **Mood:** {t.get('Mood/Style Keywords', '')}")

    if recommendation['landing']:
        l = recommendation['landing']
        print(f"\n#### 📐 Landing Page Strategy")
        print(f"- **Pattern Name:** {l.get('Pattern Name', '')}")
        print(f"- **Section Order:** {l.get('Section Order', '')}")
        print(f"- **Primary CTA Placement:** {l.get('Primary CTA Placement', '')}")
        print(f"- **Conversion Optimization:** {l.get('Conversion Optimization', '')}")

    # Check for relevant stack snippets
    # Try to find 'react' as default or if query contains it
    stack_query = 'react'
    if 'next' in query: stack_query = 'nextjs'
    if 'mobile' in query or 'app' in query: stack_query = 'react-native'
    
    snippets = core.search(f'stack_{stack_query}', query, keys=['Sub-category', 'Task'])
    if snippets:
        print(f"\n#### 💻 Implementation Snippet ({stack_query})")
        s = snippets[0]
        print(f"**Task:** {s.get('Task', '')}")
        print(f"```javascript\n{s.get('Code Snippet', '')}\n```")

if __name__ == "__main__":
    main()
