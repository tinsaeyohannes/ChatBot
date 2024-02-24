import React, {type FC} from 'react';
import {StatusBar, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {userStore} from '../store/useStore';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ParamListBase} from '@react-navigation/native';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};
const ProfileScreen: FC<ProfileScreenProps> = ({}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        isDarkMode ? styles.darkBg : styles.lightBg,
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>ProfileScreen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBg: {
    backgroundColor: '#031C1A',
  },
  lightBg: {
    backgroundColor: '#E5E5E5',
  },
});

export default ProfileScreen;
