# 🎯 Z-Index Hierarchy Documentation

**Date**: 2025-11-02  
**Version**: 2.0  
**Status**: Organized & Documented

## 📊 Complete Z-Index Hierarchy

```
┌─────────────────────────────────────────────┐
│  LEVEL 1080: Top Notifications             │  --z-notification
│  ├─ Game notifications                     │
│  └─ Achievement toasts                     │
├─────────────────────────────────────────────┤
│  LEVEL 1070: Tooltips                      │  --z-tooltip
│  ├─ Portrait dialogues (z-index:10005)     │
│  └─ Info tooltips                          │
├─────────────────────────────────────────────┤
│  LEVEL 1060: Popovers                      │  --z-popover
│  ├─ Tamagotchi context menu               │
│  ├─ Dropdown menus                         │
│  └─ Contextual actions                     │
├─────────────────────────────────────────────┤
│  LEVEL 1050: Modals                        │  --z-modal
│  ├─ Color picker overlay (10000)          │
│  ├─ Theater overlay (10000)               │
│  ├─ Mini-game overlay (10000)             │
│  ├─ Shop modal (20001)                    │
│  └─ Settings modal                         │
├─────────────────────────────────────────────┤
│  LEVEL 1040: Modal Backdrops              │  --z-modal-backdrop
│  ├─ Semi-transparent backgrounds          │
│  └─ Blur overlays                          │
├─────────────────────────────────────────────┤
│  LEVEL 1030: Fixed UI Elements            │  --z-fixed
│  ├─ Header actions bar                    │
│  ├─ Language switcher                     │
│  └─ Game toggle button                    │
├─────────────────────────────────────────────┤
│  LEVEL 1020: Sticky Elements              │  --z-sticky
│  ├─ Sticky headers                        │
│  └─ Fixed sidebars                         │
├─────────────────────────────────────────────┤
│  LEVEL 1000: Dropdowns                    │  --z-dropdown
│  ├─ Navigation dropdowns                  │
│  └─ Select menus                           │
├─────────────────────────────────────────────┤
│  LEVEL 1: Base Content                    │  --z-base
│  ├─ Standard elements                     │
│  └─ Default stacking                       │
└─────────────────────────────────────────────┘
```

## 🔧 Migration Plan

### Current Issues (Before Fix):
- **3 overlays at z-index:10000** → Potential conflicts
- **Shop at z-index:20001** → Unnecessarily high
- **No standardized scale** → Hard to maintain

### After Migration:
- ✅ **All overlays at z-index:1050** (--z-modal)
- ✅ **Notifications at z-index:1080** (--z-notification)
- ✅ **Tooltips at z-index:1070** (--z-tooltip)
- ✅ **Standardized CSS variables** for easy management

## 📝 Usage Guidelines

### DO:
```css
/* ✅ Use CSS variables from design-system.css */
.my-modal {
    z-index: var(--z-modal);
}

.my-tooltip {
    z-index: var(--z-tooltip);
}
```

### DON'T:
```css
/* ❌ Don't use hardcoded values */
.my-element {
    z-index: 10000;
}

/* ❌ Don't use arbitrary large numbers */
.my-other-element {
    z-index: 999999;
}
```

## 🎨 Elements by Category

### Overlays (z-index:1050)
- `.color-picker-overlay`
- `.theater-overlay`
- `.mini-game-overlay`
- `.shop-modal`
- `.minigame-modal`

### Notifications (z-index:1080)
- `.game-notification`
- `.achievement-toast`

### Tooltips (z-index:1070)
- `.portrait-dialogue`
- `.tama-tooltip`

### Popovers (z-index:1060)
- `.tama-context-menu`
- Dropdown menus

### Fixed UI (z-index:1030)
- `.header-actions`
- `.game-hud`
- `.tamagotchi`

## 🚀 Implementation Status

### Phase 1: Documentation ✅
- [x] Create Z-INDEX-HIERARCHY.md
- [x] Document all existing z-index values
- [x] Define CSS variables in design-system.css

### Phase 2: Migration (In Progress)
- [x] Update design-system.css variables
- [ ] Replace hardcoded z-index in index.html (minified CSS - requires careful replacement)
- [ ] Update tamagotchi-shop.css to use variables
- [ ] Test all overlay interactions

### Phase 3: Validation (Pending)
- [ ] Visual testing of all overlays
- [ ] Ensure no stacking conflicts
- [ ] Mobile responsive testing
- [ ] Browser compatibility check

## 📌 Notes

- **CSS is minified in index.html** - Makes manual replacement difficult
- **Recommendation**: Extract all CSS to separate files for easier maintenance
- **Current approach**: Use CSS variables for new components, gradually migrate legacy code
- **Shop system**: Already uses proper CSS file structure (tamagotchi-shop.css)

## 🔗 Related Files
- `/home/user/webapp/design-system.css` - CSS variables definition
- `/home/user/webapp/tamagotchi-shop.css` - Shop-specific z-index values
- `/home/user/webapp/index.html` - Main file with minified CSS (needs extraction)
