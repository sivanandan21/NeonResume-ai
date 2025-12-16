export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string; // Headings, Name
    secondary: string; // Subheadings, Dates
    accent: string; // Icons, Borders, Highlights
  }
}

export const themes: Theme[] = [
  // --- DARK / FUTURISTIC THEMES ---
  {
    id: 'cyber-black',
    name: 'Cyber Black',
    colors: { background: '#000000', text: '#e0e0e0', primary: '#ffffff', secondary: '#a0a0a0', accent: '#06b6d4' } // Cyan accent
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    colors: { background: '#0f0720', text: '#e9d5ff', primary: '#d8b4fe', secondary: '#a855f7', accent: '#c084fc' }
  },
  {
    id: 'matrix',
    name: 'The Matrix',
    colors: { background: '#000000', text: '#22c55e', primary: '#4ade80', secondary: '#15803d', accent: '#16a34a' }
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    colors: { background: '#0b0b0b', text: '#c0c0c0', primary: '#ffffff', secondary: '#505050', accent: '#ef4444' } // Red accent
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    colors: { background: '#0f172a', text: '#cbd5e1', primary: '#38bdf8', secondary: '#475569', accent: '#0ea5e9' }
  },
  {
    id: 'dracula',
    name: 'Vampire',
    colors: { background: '#282a36', text: '#f8f8f2', primary: '#ff79c6', secondary: '#bd93f9', accent: '#50fa7b' }
  },
  {
    id: 'slate-dim',
    name: 'Slate Dim',
    colors: { background: '#1e293b', text: '#e2e8f0', primary: '#f1f5f9', secondary: '#94a3b8', accent: '#fbbf24' } // Amber accent
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    colors: { background: '#1a1a1a', text: '#e5e5e5', primary: '#ffd700', secondary: '#b8860b', accent: '#daa520' }
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    colors: { background: '#180018', text: '#ffccff', primary: '#ff00ff', secondary: '#ff66ff', accent: '#ff00cc' }
  },
  {
    id: 'hacker-console',
    name: 'Console',
    colors: { background: '#121212', text: '#33ff00', primary: '#33ff00', secondary: '#00cc00', accent: '#ffffff' }
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    colors: { background: '#020617', text: '#e2e8f0', primary: '#a78bfa', secondary: '#4c1d95', accent: '#6366f1' }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    colors: { background: '#272822', text: '#f8f8f2', primary: '#a6e22e', secondary: '#66d9ef', accent: '#f92672' }
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    colors: { background: '#052e16', text: '#dcfce7', primary: '#4ade80', secondary: '#166534', accent: '#22c55e' }
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    colors: { background: '#002b36', text: '#839496', primary: '#b58900', secondary: '#586e75', accent: '#2aa198' }
  },
  {
    id: 'coffee-dark',
    name: 'Espresso',
    colors: { background: '#1c1917', text: '#d6d3d1', primary: '#a8a29e', secondary: '#57534e', accent: '#d97706' }
  },

  // --- LIGHT / PROFESSIONAL THEMES ---
  {
    id: 'classic-white',
    name: 'Classic White',
    colors: { background: '#ffffff', text: '#1f2937', primary: '#111827', secondary: '#4b5563', accent: '#3b82f6' } // Blue accent
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    colors: { background: '#f8fafc', text: '#334155', primary: '#0f172a', secondary: '#64748b', accent: '#06b6d4' }
  },
  {
    id: 'paper-cream',
    name: 'Paper Cream',
    colors: { background: '#fffbeb', text: '#451a03', primary: '#78350f', secondary: '#92400e', accent: '#d97706' }
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    colors: { background: '#f3f4f6', text: '#374151', primary: '#111827', secondary: '#6b7280', accent: '#9ca3af' }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    colors: { background: '#ffffff', text: '#1e3a8a', primary: '#172554', secondary: '#3b82f6', accent: '#2563eb' }
  },
  {
    id: 'clean-green',
    name: 'Clean Green',
    colors: { background: '#f0fdf4', text: '#14532d', primary: '#15803d', secondary: '#166534', accent: '#22c55e' }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: { background: '#fff1f2', text: '#881337', primary: '#be123c', secondary: '#9f1239', accent: '#fb7185' }
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    colors: { background: '#faf5ff', text: '#581c87', primary: '#6b21a8', secondary: '#7e22ce', accent: '#a855f7' }
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    colors: { background: '#f0f9ff', text: '#0c4a6e', primary: '#0369a1', secondary: '#0ea5e9', accent: '#38bdf8' }
  },
  {
    id: 'sunset-light',
    name: 'Sunset',
    colors: { background: '#fff7ed', text: '#7c2d12', primary: '#c2410c', secondary: '#ea580c', accent: '#f97316' }
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    colors: { background: '#ecfdf5', text: '#064e3b', primary: '#059669', secondary: '#10b981', accent: '#34d399' }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    colors: { background: '#fdf6e3', text: '#657b83', primary: '#b58900', secondary: '#93a1a1', accent: '#2aa198' }
  },
  {
    id: 'swiss-design',
    name: 'Swiss',
    colors: { background: '#ffffff', text: '#000000', primary: '#ff0000', secondary: '#666666', accent: '#ff0000' }
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    colors: { background: '#e5e5e5', text: '#171717', primary: '#000000', secondary: '#525252', accent: '#404040' }
  },
  {
    id: 'ivory-elegance',
    name: 'Ivory',
    colors: { background: '#fffff0', text: '#2f4f4f', primary: '#000080', secondary: '#708090', accent: '#daa520' }
  }
];

export const DEFAULT_THEME = themes[0];
