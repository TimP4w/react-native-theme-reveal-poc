import React, {FunctionComponent, useContext, useState} from 'react';
import {StyleSheet, View, Modal, Image, StyleProp, ViewStyle} from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {CaptureOptions, captureScreen} from 'react-native-view-shot';
import { ThemeContext } from '../providers/ThemeProvider';
import { THEMES } from '../styles/themes';
import Button from './elements/Button';

export interface ThemeSwitchProps {
  style: StyleProp<ViewStyle>;
}

const ThemeSwitch: FunctionComponent<ThemeSwitchProps> = ({
  style,
}) => {
  // Screenshot settings
  const SCREENSHOT_SETTINGS: CaptureOptions = {
    format: 'jpg', // jpg = 35-45ms, png = 140 - 153ms
    quality: 1,
  };

  /* States */
  const theme = useContext(ThemeContext); 
  const COLORS = theme.colors;

  const [screenshotURI, setScreenshotURI] = useState('');
  const isRevealingNewTheme: boolean = screenshotURI.length > 0;
  const revealOpacity = useSharedValue<number>(1);

  const overlayRevealStyle = useAnimatedStyle(() => {
    const opacity = revealOpacity.value;
    return { opacity: opacity };
  });

  const resetAfterReveal = (): void => {
    setScreenshotURI('');
    revealOpacity.value = 1;
  };

  const takeScreenshot = async (): Promise<void> => {
    const captureURI = await captureScreen(SCREENSHOT_SETTINGS);
    setScreenshotURI(captureURI);
  };

  const toggleTheme = (): void => {
    if (COLORS.THEME === THEMES.DARK) {
      theme.setTheme(THEMES.LIGHT);
    } else {
      theme.setTheme(THEMES.DARK);
    }
  };

  const onImageLoad = (): void => {
    revealOpacity.value = withTiming(0, { duration: 500 }, () => { runOnJS(resetAfterReveal)() });
    toggleTheme();
  };

  const changeTheme = async (): Promise<void> => {
    await takeScreenshot();
  };

  return (
    <View style={style}>
      {isRevealingNewTheme && (
        <Modal
          transparent={true}
          style={styles.modal}
          visible={isRevealingNewTheme}>
          <View style={styles.modalContent}>
            <Animated.View
                style={[
                  styles.screenshotContainer,
                  overlayRevealStyle,
                ]}>
              <Image
                resizeMode={'contain'}
                fadeDuration={0}
                style={styles.screenshot}
                onLoad={onImageLoad}
                source={{uri: screenshotURI}}
              />
            </Animated.View>
          </View>
        </Modal>
      )}
      <Button label={'Switch Theme'} onPressIn={changeTheme} />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    width: '100%',
  },
  modalContent: {
    alignItems: 'center',
  },
  screenshotContainer: {
    width: '100%',
    height: '100%',
  },
  screenshot: {
    width: '100%',
    height: '100%',
  },
});

export default ThemeSwitch;
