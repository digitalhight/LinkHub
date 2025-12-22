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
  id?: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  phone?: string;
  email?: string;
  links: LinkItem[];
  theme: ThemeConfig;
  is_admin?: boolean;
  is_active?: boolean; // Nouveau champ pour le statut du compte
  created_at?: string;
}

export enum EditorTab {
  PROFILE = 'PROFILE',
  LINKS = 'LINKS',
  THEME = 'THEME',
}