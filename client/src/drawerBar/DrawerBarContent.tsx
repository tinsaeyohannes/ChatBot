import React from 'react';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {StyleSheet} from 'react-native';
import ConversationHistoryScreen from '../screens/ConversationHistoryScreen';
import {userStore} from '../store/useStore';
import {SafeAreaView} from 'react-native-safe-area-context';

const DrawerBarContent = (
  props: DrawerContentComponentProps,
): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        isDarkMode ? styles.darkBg : styles.lightBg,
      ]}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled
        contentContainerStyle={styles.DrawerContentScrollView}>
        <ConversationHistoryScreen />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#101010',
  },
  darkBg: {
    backgroundColor: '#101010',
  },
  lightBg: {
    backgroundColor: '#E5E5E5',
  },
  DrawerContentScrollView: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default DrawerBarContent;
