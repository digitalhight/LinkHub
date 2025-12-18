export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: string; 
}

export interface ThemeConfig {
  id: string;
  name: string;
  backgroundStart: string; // Hex
  backgroundEnd: string;   // Hex
  buttonBg: string;        // Hex
  buttonText: string;      // Hex
  textColor: string;       // Hex
  fontFamily: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  phone?: string;
  email?: string;
  links: LinkItem[];
  theme: ThemeConfig;
}

export enum EditorTab {
  PROFILE = 'PROFILE',
  LINKS = 'LINKS',
  THEME = 'THEME',
}