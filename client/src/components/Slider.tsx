import React, {useCallback, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import type {IDefaultSliderProps, ISliderProps} from '../types/sliderTypes';

const initialAnimatedValue = new Animated.Value(0);
export const SLIDER_SIZE = 50;
export const DEFAULT_SLIDER_SIZE = {width: SLIDER_SIZE, height: SLIDER_SIZE};

export const SLIDER_ARROW_SIZE = 10;

const DefaultSlider: React.FC<IDefaultSliderProps> = ({
  sliderSize = DEFAULT_SLIDER_SIZE,
  sliderStyles,
}) => {
  return (
    <View style={[styles.slider, sliderStyles, sliderSize]}>
      <View style={[styles.sliderArrow, styles.sliderArrowRight]} />
      <View style={[styles.sliderArrow, styles.sliderArrowLeft]} />
    </View>
  );
};

export const Slider: React.FC<ISliderProps> = props => {
  const {
    containerSize: {height: containerHeight},
    translateX = initialAnimatedValue,
    sliderSize = DEFAULT_SLIDER_SIZE,
    sliderStyles,
    showSeparationLine = true,
    separationLineStyles,
    SliderComponent = (
      <DefaultSlider sliderSize={sliderSize} sliderStyles={sliderStyles} />
    ),
  } = props;
  const lastOffsetX = useRef(0);

  const onPanGestureEvent = Animated.event(
    [{nativeEvent: {translationX: translateX}}],
    {
      useNativeDriver: false,
    },
  );

  const onHandlerStateChange = useCallback(
    (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        lastOffsetX.current += event.nativeEvent.translationX;
        translateX.setOffset(lastOffsetX.current);
        translateX.setValue(0);
      }
    },
    [translateX],
  );

  return (
    <PanGestureHandler
      activeOffsetX={[-0, 0]}
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={[sliderSize, styles.animatedView, {transform: [{translateX}]}]}
        pointerEvents="box-only">
        {showSeparationLine && (
          <View
            style={[
              styles.separationLine,
              {height: containerHeight},
              separationLineStyles,
            ]}
          />
        )}
        {SliderComponent}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  slider: {
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: SLIDER_SIZE / 2,
    justifyContent: 'center',
  },
  sliderArrow: {
    width: SLIDER_ARROW_SIZE,
    height: SLIDER_ARROW_SIZE,
    position: 'absolute',
    borderTopWidth: SLIDER_ARROW_SIZE,
    borderTopColor: 'transparent',
    borderBottomWidth: SLIDER_ARROW_SIZE,
    borderBottomColor: 'transparent',
  },
  sliderArrowRight: {
    right: 8,
    borderLeftWidth: SLIDER_ARROW_SIZE,
    borderLeftColor: 'green',
  },
  sliderArrowLeft: {
    left: 8,
    borderRightWidth: SLIDER_ARROW_SIZE,
    borderRightColor: 'green',
  },
  separationLine: {
    backgroundColor: 'darkgray',
    width: 2,
    position: 'absolute',
  },
});
