import React, {ExoticComponent, ProviderExoticComponent, ProviderProps, useState} from 'react';
import {DARK_THEME, LIGHT_THEME, Theme, THEMES} from '../styles/themes';
import {useColorScheme} from 'react-native';

export interface ThemeProviderProps {
  colors: Theme;
  setTheme: (theme: THEMES) => void;
}

export const ThemeContext = React.createContext<Partial<ThemeProviderProps>>({});

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const isLightMode = useColorScheme() === 'light';
  // Let's take the default theme from the user device settings
  const defaultTheme: Theme = isLightMode ? LIGHT_THEME : DARK_THEME;
  // State holding the theme
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Setter method
  const themeSetter = (newTheme: THEMES) => {
    switch (newTheme) {
      case THEMES.LIGHT:
        setTheme(LIGHT_THEME);
        break; 
      case THEMES.DARK:
        setTheme(DARK_THEME);
        break; 
      default:
        setTheme(defaultTheme);
        break; 
    }
  };

  // Initialized context
  const initContext = {
    colors: theme,
    setTheme: themeSetter,
  };

  return (
    <ThemeContext.Provider value={initContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
