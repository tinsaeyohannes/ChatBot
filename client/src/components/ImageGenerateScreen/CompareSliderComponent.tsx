/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

import type {ICompareSlider} from '../../types/sliderTypes';
import {Slider} from '../Slider';

export const CompareSliderComponent: React.FC<ICompareSlider> = props => {
  const {
    before,
    after,
    containerSize,
    sliderSize,
    SliderComponent,
    sliderStyles,
    showSeparationLine,
  } = props;
  const {width: containerWidth, height: containerHeight} = containerSize;
  const translateX = useRef(new Animated.Value(0));
  const boxWidth = useRef(Animated.add(translateX.current, containerWidth / 2));

  return (
    <View
      style={[
        {
          width: containerWidth,
          height: containerHeight,
          overflow: 'hidden',
        },
      ]}>
      <View
        style={{
          position: 'absolute',
          width: containerWidth,
          height: containerHeight,
        }}>
        <Animated.View
          style={[styles.item, styles.itemBefore, {width: boxWidth.current}]}>
          {before}
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.itemAfter, {left: boxWidth.current}]}>
          <Animated.View
            style={[styles.itemAfterChild, {width: containerWidth}]}>
            {after}
          </Animated.View>
        </Animated.View>
      </View>
      <Slider
        translateX={translateX.current}
        sliderSize={sliderSize}
        containerSize={containerSize}
        sliderStyles={sliderStyles}
        SliderComponent={SliderComponent}
        showSeparationLine={showSeparationLine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  itemBefore: {
    left: 0,
  },
  itemAfter: {
    right: 0,
  },
  itemAfterChild: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
