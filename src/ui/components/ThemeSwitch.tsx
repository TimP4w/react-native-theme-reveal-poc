import React, {FunctionComponent, useContext, useState} from 'react';
import {StyleSheet, View, Modal, StyleProp, ViewStyle, Dimensions} from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {CaptureOptions, captureScreen} from 'react-native-view-shot';
import { ThemeContext } from '../providers/ThemeProvider';
import { THEMES } from '../styles/themes';
import Button from './elements/Button';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { discreteOffset, minimumEnclosingScale } from '../helpers/circle';

export interface ThemeSwitchOptions {
  initialScale?: number;
  endScale?: number;
  revealDuration?: number;
  offsetX?: number,
  offsetY?: number,
}

export interface ThemeSwitchProps {
  style: StyleProp<ViewStyle>;
  options?: ThemeSwitchOptions;
}

const ThemeSwitch: FunctionComponent<ThemeSwitchProps> = ({
  style,
  options,
}) => {
  const WINDOW = Dimensions.get('window');
  const SAFE_OFFSET = StaticSafeAreaInsets; // TODO: This value is wrong on certain devices but needed on others...
  const SCREEN_WIDTH = WINDOW.width; 
  const SCREEN_HEIGHT = WINDOW.height;
  const MAX_SIDE = Math.max(SCREEN_HEIGHT, SCREEN_WIDTH);

  const defaultOptions: ThemeSwitchOptions = {
    initialScale: minimumEnclosingScale(options?.offsetX, options?.offsetY, SCREEN_WIDTH, SCREEN_HEIGHT), // minimal circle size to cover whole screen
    endScale: 0, 
    revealDuration: 500, // in ms
    offsetX: 0,
    offsetY: 0,
  }

  const revealOptions: ThemeSwitchOptions = Object.assign(defaultOptions, options)

  /* This only calculates the actual offset based from % values */
  const POSITION_OFFSET_X = discreteOffset(SCREEN_WIDTH, revealOptions.offsetX); 
  const POSITION_OFFSET_Y = discreteOffset(SCREEN_HEIGHT, revealOptions.offsetY);

  // Screenshot settings
  const SCREENSHOT_SETTINGS: CaptureOptions = {
    format: 'jpg', //jpg causes less stutter than png
    result: 'data-uri'
  };

  /* States */
  const theme = useContext(ThemeContext); 
  const COLORS = theme.colors;

  const [screenshotURI, setScreenshotURI] = useState('');
  const isRevealingNewTheme: boolean = screenshotURI.length > 0;
  const revealScale = useSharedValue<number>(revealOptions.initialScale);
  const [isAnimationInProgress, setIsAnimationInProgress] = useState(false);

  /* Animations */
  const overlayRevealAnimatedStyle = useAnimatedStyle(() => {
    const scale = revealScale.value;
    return {
      transform: [
        {
          scale: scale,
        },
      ],
    };
  });

  const screenshotScaleAnimatedStyle = useAnimatedStyle(() => {
    const scale = 1 / revealScale.value; // Reverse scale of parent view (circle)
    return {
      transform: [
        {
          scale: scale,
        },
        {
          translateY: POSITION_OFFSET_Y,
        },
        {
          translateX: POSITION_OFFSET_X,
        },
      ],
    };
  });

  const resetAfterReveal = (): void => {
    setIsAnimationInProgress(false);
    setScreenshotURI('');
    revealScale.value = revealOptions.initialScale;
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
     if (!isAnimationInProgress) { // hack to fix FastImage to call "onLoad" twice
      setIsAnimationInProgress(true);
      revealScale.value = withTiming(revealOptions.endScale, 
        { duration: defaultOptions.revealDuration }, 
        () => { 
          runOnJS(resetAfterReveal)() 
        });
      toggleTheme();
    }
  };

  const changeTheme = async (): Promise<void> => {
    await takeScreenshot();
  };
 
  const AnimatedImage = Animated.createAnimatedComponent(FastImage as React.FunctionComponent<FastImageProps>);
 
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
                  {    
                    width: MAX_SIDE,
                    height: MAX_SIDE,
                    borderRadius: MAX_SIDE / 2
                  },
                  {bottom: POSITION_OFFSET_Y, right: POSITION_OFFSET_X},
                  overlayRevealAnimatedStyle,
                ]}>
                <AnimatedImage
                  resizeMode={FastImage.resizeMode.contain}
                  style={[styles.screenshot, screenshotScaleAnimatedStyle,       
                 ]}
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
    overflow: 'hidden',
  },
  screenshot: {
    width: '100%',
    height: '100%',
  },
});

export default ThemeSwitch;
