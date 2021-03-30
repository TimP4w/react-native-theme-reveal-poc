import React, {FunctionComponent, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import Button from '../components/elements/Button';
import { ThemeContext } from '../providers/ThemeProvider';
import { THEMES } from '../styles/themes';


const Home: FunctionComponent<unknown> = ({}) => {
  const COLORS = useContext(ThemeContext).colors;
  const theme = useContext(ThemeContext);

  const toggleTheme = () => {
    if (COLORS.THEME === THEMES.DARK) {
      theme.setTheme(THEMES.LIGHT);
    } else {
      theme.setTheme(THEMES.DARK);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: COLORS.background}]}>
        <Text style={[styles.textStyle, {color: COLORS.text}]}>
          Test theme switch animation :)
        </Text>
        <Button label={'Toggle Theme'} onPressIn={toggleTheme} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    marginBottom: 50,
  },
});

export default Home;
