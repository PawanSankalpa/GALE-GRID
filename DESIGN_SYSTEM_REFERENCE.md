# Premium CRM Design System - Quick Reference

## 🎨 Color Palette

### Primary (Blues)
```css
--primary-50: #eff6ff   /* Very light blue - backgrounds */
--primary-100: #dbeafe  /* Light blue - hover states */
--primary-500: #3b82f6  /* Main brand blue - primary actions */
--primary-600: #2563eb  /* Dark blue - hover on primary */
--primary-900: #1e3a8a  /* Very dark blue - text */
```

### Grays (Neutrals)
```css
--gray-50: #f8fafc     /* Lightest - page background */
--gray-100: #f1f5f9    /* Light - card hover */
--gray-200: #e2e8f0    /* Borders, dividers */
--gray-500: #64748b    /* Medium - placeholder text */
--gray-700: #334155    /* Dark - labels */
--gray-900: #0f172a    /* Darkest - headings */
```

### Status Colors
```css
--status-discovery: #8b5cf6    /* Purple */
--status-design: #3b82f6       /* Blue */
--status-development: #10b981  /* Green */
--status-review: #f59e0b       /* Amber */
--status-live: #06b6d4         /* Cyan */
```

---

## 📏 Spacing Scale (4px base)

```css
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-3: 0.75rem  /* 12px */
--space-4: 1rem     /* 16px */
--space-5: 1.25rem  /* 20px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-10: 2.5rem  /* 40px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
```

**Common Uses:**
- **Padding**: var(--space-4) to var(--space-6)
- **Gaps**: var(--space-4) to var(--space-6)
- **Margins**: var(--space-6) to var(--space-10)

---

## 🔤 Typography Scale

```css
--text-xs: 0.75rem     /* 12px - labels, badges */
--text-sm: 0.875rem    /* 14px - body small */
--text-base: 1rem      /* 16px - body text */
--text-lg: 1.125rem    /* 18px - emphasis */
--text-xl: 1.25rem     /* 20px - card titles */
--text-2xl: 1.5rem     /* 24px - section titles */
--text-3xl: 1.875rem   /* 30px - page titles */
--text-4xl: 2.25rem    /* 36px - hero titles */
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

---

## 🌊 Shadows (Depth)

```css
--shadow-sm: subtle card shadow
--shadow: default card shadow
--shadow-md: elevated card shadow
--shadow-lg: hover card shadow
--shadow-xl: modal shadow
--shadow-2xl: hero shadow
```

**Usage:**
- Cards at rest: `box-shadow: var(--shadow);`
- Cards on hover: `box-shadow: var(--shadow-lg);`
- Modals/Overlays: `box-shadow: var(--shadow-xl);`

---

## ⚡ Transitions

```css
--transition-fast: 150ms   /* Quick interactions */
--transition-base: 200ms   /* Standard */
--transition-slow: 300ms   /* Smooth animations */

/* Easing: cubic-bezier(0.4, 0, 0.2, 1) */
```

**Usage:**
```css
transition: all var(--transition-base);
```

---

## 🔲 Border Radius

```css
--radius-sm: 0.375rem   /* 6px - small elements */
--radius: 0.5rem        /* 8px - buttons, inputs */
--radius-md: 0.75rem    /* 12px - cards */
--radius-lg: 1rem       /* 16px - large cards */
--radius-xl: 1.5rem     /* 24px - modals */
--radius-full: 9999px   /* Fully rounded */
```

---

## 🎯 Common Patterns

### Premium Card
```css
background: white;
padding: var(--space-6);
border-radius: var(--radius-lg);
box-shadow: var(--shadow);
border: 1px solid var(--gray-200);
transition: all var(--transition-base);
```

### Hover Effect
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}
```

### Primary Button
```css
background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
color: white;
padding: var(--space-4) var(--space-6);
border-radius: var(--radius-md);
font-weight: 600;
box-shadow: var(--shadow-md);
transition: all var(--transition-base);
```

### Icon Container
```css
width: 64px;
height: 64px;
display: flex;
align-items: center;
justify-content: center;
background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
border-radius: var(--radius-lg);
color: var(--primary-600);
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop (default) */
> 1024px: Full sidebar, multi-column grids

/* Tablet */
@media (max-width: 1024px) {
  /* Collapsible sidebar, 2-column grids */
}

/* Mobile */
@media (max-width: 768px) {
  /* Overlay sidebar, single column */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Compact spacing, reduced fonts */
}
```

---

## 🎨 Icon System

### Import from React Icons:
```jsx
import { 
  MdDashboard,
  MdFolder,
  MdMessage,
  MdAttachFile,
  MdPeople,
  MdRocket,
  MdBarChart,
  MdHome,
  MdLogout,
  MdClose,
  MdMenu,
  MdArrowForward,
  MdArrowBack,
  MdCheckCircle,
  MdWarning,
  MdSchedule,
  MdSearch,
  MdDesignServices,
  MdCode,
  MdRateReview,
  MdSend,
  MdCloudUpload,
  MdDownload,
  MdDelete,
  MdCalendarToday,
  MdAttachMoney,
  MdTrendingUp,
  MdTimeline,
  MdBolt,
  MdShowChart,
  MdWavingHand,
  MdLightbulbOutline,
  MdFolderOpen,
  MdSupport,
  MdPerson
} from 'react-icons/md';
```

### Icon Sizes:
```css
.icon-sm { font-size: var(--text-base); }     /* 16px */
.icon-md { font-size: var(--text-xl); }       /* 20px */
.icon-lg { font-size: var(--text-2xl); }      /* 24px */
.icon-xl { font-size: var(--text-3xl); }      /* 30px */
.icon-2xl { font-size: var(--text-4xl); }     /* 36px */
```

---

## 🎭 Animation Keyframes

### Wave (Greeting)
```css
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
}
```

### Pulse (Active Stepper)
```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
}
```

### Shimmer (Progress Bar)
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Spin (Loading)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 🎨 Gradient Recipes

### Primary Gradient (Buttons, Badges)
```css
background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
```

### Card Background (Subtle)
```css
background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
```

### Warning Highlight
```css
background: linear-gradient(135deg, var(--warning-50) 0%, #fff7ed 100%);
```

### Success State
```css
background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
```

---

## 📦 Common CSS Classes

### Layout
```css
.crm-layout           /* Main container */
.crm-sidebar          /* Fixed sidebar */
.crm-main             /* Main content area */
.crm-content          /* Inner content wrapper */
.crm-mobile-header    /* Mobile top bar */
```

### Cards
```css
.stat-card            /* Dashboard stat card */
.project-card         /* Project card */
.status-card          /* Status breakdown card */
.admin-stat-card      /* Admin dashboard stat */
```

### Navigation
```css
.nav-item             /* Navigation link */
.nav-item.active      /* Active nav item */
.nav-icon             /* Nav icon */
.nav-label            /* Nav text */
```

### Buttons
```css
.crm-button           /* Base button */
.crm-button--primary  /* Primary variant */
.crm-button--secondary /* Secondary variant */
.crm-button--ghost    /* Ghost variant */
```

### Inputs
```css
.crm-input-container  /* Input wrapper */
.crm-input            /* Input field */
.crm-input-label      /* Input label */
.crm-input-icon       /* Input icon */
```

---

## ✨ Quick Tips

### Creating New Cards:
1. Start with white background
2. Add `padding: var(--space-6)`
3. Use `border-radius: var(--radius-lg)`
4. Apply `box-shadow: var(--shadow)`
5. Add `border: 1px solid var(--gray-200)`
6. Include hover state with `translateY(-4px)`

### Adding Icons:
1. Import from 'react-icons/md'
2. Use as component: `<MdIcon />`
3. Style with className: `className="icon-class"`
4. Control size via CSS font-size

### Spacing Elements:
1. Use `gap` for flex/grid layouts
2. Use `margin` between sections (var(--space-8) to var(--space-12))
3. Use `padding` within components (var(--space-4) to var(--space-6))

### Color Selection:
1. **Text**: gray-900 (headings), gray-700 (labels), gray-600 (body)
2. **Backgrounds**: white (cards), gray-50 (page), gray-100 (hover)
3. **Borders**: gray-200 (default), gray-300 (emphasis)
4. **Actions**: primary-500 (CTA), danger-500 (delete), success-500 (confirm)

---

## 🚀 Getting Started Checklist

- [ ] Verify `react-icons` is installed
- [ ] Import `crm-premium.css` in App.jsx
- [ ] Test all CRM pages for visual consistency
- [ ] Check mobile responsiveness
- [ ] Verify icon rendering (no console errors)
- [ ] Test hover/focus states
- [ ] Validate color contrast (accessibility)
- [ ] Test loading states
- [ ] Review animations (not too fast/slow)
- [ ] Check print styles

---

**This is your design system foundation. Use these patterns consistently to maintain the premium feel throughout your CRM.**
