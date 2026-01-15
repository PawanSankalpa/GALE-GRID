#!/bin/bash

# Update pricing tier styles
sed -i '' '2152,2180{
s/background: rgba(0, 0, 0, 0.01);/background: #FFFFFF;/
s/border: 1px solid var(--sp-white-90);/border: 1px solid #F0F0F0;/
s/border-radius: var(--sp-radius-xl);/border-radius: var(--sp-radius-2xl);/
s/box-shadow: var(--sp-shadow-sm);/box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);/
s/transition: all var(--sp-bounce);/transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);/
}' Services.css

# Update contact card styling  
sed -i '' 's/border: 1px solid rgba(255, 255, 255, 0.1);/border: 1px solid rgba(255, 255, 255, 0.08);/' Services.css
sed -i '' 's/background: rgba(255, 255, 255, 0.05);/background: rgba(255, 255, 255, 0.02);/' Services.css
