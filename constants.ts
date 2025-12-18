import { UserProfile, ThemeConfig } from './types';

export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'default-slate',
    name: 'Clean Slate',
    backgroundStart: '#f8fafc',
    backgroundEnd: '#e2e8f0',
    buttonBg: '#ffffff',
    buttonText: '#1e293b',
    textColor: '#0f172a',
    fontFamily: 'Inter',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight',
    backgroundStart: '#0f172a',
    backgroundEnd: '#1e293b',
    buttonBg: '#334155',
    buttonText: '#f8fafc',
    textColor: '#f1f5f9',
    fontFamily: 'Inter',
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset',
    backgroundStart: '#ffedd5',
    backgroundEnd: '#fed7aa',
    buttonBg: '#fb923c',
    buttonText: '#fff7ed',
    textColor: '#431407',
    fontFamily: 'Inter',
  },
  {
    id: 'forest-calm',
    name: 'Forest',
    backgroundStart: '#f0fdf4',
    backgroundEnd: '#dcfce7',
    buttonBg: '#15803d',
    buttonText: '#ffffff',
    textColor: '#052e16',
    fontFamily: 'Inter',
  },
  {
    id: 'berry-burst',
    name: 'Berry',
    backgroundStart: '#fce7f3',
    backgroundEnd: '#fbcfe8',
    buttonBg: '#be185d',
    buttonText: '#ffffff',
    textColor: '#831843',
    fontFamily: 'Inter',
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Developer',
  bio: 'Building the future with React & AI. 🚀',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
  phone: '',
  email: '',
  links: [
    { id: '1', title: 'My Portfolio', url: 'https://example.com', isActive: true },
    { id: '2', title: 'GitHub', url: 'https://github.com', isActive: true },
    { id: '3', title: 'Twitter / X', url: 'https://twitter.com', isActive: true },
    { id: '4', title: 'LinkedIn', url: 'https://linkedin.com', isActive: false },
  ],
  theme: DEFAULT_THEMES[0],
};