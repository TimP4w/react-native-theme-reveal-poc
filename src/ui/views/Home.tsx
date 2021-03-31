import React, {FunctionComponent, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import ThemeSwitch from '../components/ThemeSwitch';
import { ThemeContext } from '../providers/ThemeProvider';


const Home: FunctionComponent<unknown> = ({}) => {
  const COLORS = useContext(ThemeContext).colors;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: COLORS.background}]}>
        <Text style={[styles.textStyle, {color: COLORS.text}]}>
          Test theme switch animation :)
        </Text>
        <ThemeSwitch style={styles.themeSwitch}/>
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
  themeSwitch: {
    width: 150,
  }
});

export default Home;
