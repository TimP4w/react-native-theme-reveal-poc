export enum THEMES {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type Theme = {
  THEME: THEMES;
  text: string;
  background: string;
  accent: string;
  accentText: string;
}

export const DARK_THEME: Theme = {
  THEME: THEMES.DARK,
  text: '#eeeedd',
  background: '#333333',
  accent: '#443355',
  accentText: '#FFFFFF',
};

export const LIGHT_THEME: Theme = {
  THEME: THEMES.LIGHT,
  text: '#000000',
  background: '#FFFFFF',
  accent: '#F76D16',
  accentText: '#FFFFFF',
};
