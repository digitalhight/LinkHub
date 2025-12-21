import { UserProfile, ThemeConfig } from './types';

export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'cyber-nebula',
    name: 'Cyber Nebula',
    backgroundStart: '#0F011E',
    backgroundEnd: '#2D0B5A',
    buttonBg: '#A855F7',
    buttonText: '#FFFFFF',
    textColor: '#F3E8FF',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'midnight-glass',
    name: 'Midnight Glass',
    backgroundStart: '#000000',
    backgroundEnd: '#1A1A1A',
    buttonBg: '#FFFFFF',
    buttonText: '#000000',
    textColor: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'neon-horizon',
    name: 'Neon Horizon',
    backgroundStart: '#0D1117',
    backgroundEnd: '#010409',
    buttonBg: '#3B82F6',
    buttonText: '#FFFFFF',
    textColor: '#E6EDF3',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'electric-pink',
    name: 'Electric Pink',
    backgroundStart: '#111827',
    backgroundEnd: '#000000',
    buttonBg: '#EC4899',
    buttonText: '#FFFFFF',
    textColor: '#FDF2F8',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'arctic-ghost',
    name: 'Arctic Ghost',
    backgroundStart: '#F8FAFC',
    backgroundEnd: '#F1F5F9',
    buttonBg: '#0F172A',
    buttonText: '#FFFFFF',
    textColor: '#1E293B',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora',
    backgroundStart: '#020617',
    backgroundEnd: '#1E1B4B',
    buttonBg: '#2DD4BF',
    buttonText: '#042F2E',
    textColor: '#F0FDFA',
    fontFamily: 'Plus Jakarta Sans',
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Amina Creator',
  username: 'amina',
  bio: 'Transforming visions into digital reality. 🚀\nNext-Gen Creative Director.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  phone: '',
  email: '',
  links: [
    { id: '1', title: 'Voir mon Catalogue', url: 'https://example.com', isActive: true },
    { id: '2', title: 'Mes Projets AI', url: 'https://example.com/ai', isActive: true },
    { id: '3', title: 'Instagram', url: 'https://instagram.com', isActive: true },
  ],
  theme: DEFAULT_THEMES[0],
};