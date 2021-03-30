import React, {FunctionComponent, useContext} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { ThemeContext } from '../../providers/ThemeProvider';
import { Theme } from '../../styles/themes';

export interface ButtonProps {
  onPressIn: () => void;
  label: string;
}

const Button: FunctionComponent<ButtonProps> = ({onPressIn, label}) => {
  const COLORS: Theme = useContext(ThemeContext).colors;

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: COLORS.accent}]}
      onPressIn={onPressIn}>
      <Text style={{color: COLORS.accentText}}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 175,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
