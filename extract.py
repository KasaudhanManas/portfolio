import re

with open('x:/portfolio/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    with open('x:/portfolio/style.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).lstrip())
    html = html.replace(style_match.group(0), '<link rel=\"stylesheet\" href=\"style.css\" />')

# Extract script
script_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if script_match:
    with open('x:/portfolio/script.js', 'w', encoding='utf-8') as f:
        f.write(script_match.group(1).lstrip())
    html = html.replace(script_match.group(0), '<script src=\"script.js\"></script>')

with open('x:/portfolio/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Extracted CSS and JS successfully.')
