import React, {useEffect, type FC} from 'react';
import {type DrawerContentComponentProps} from '@react-navigation/drawer';
import {StyleSheet} from 'react-native';
import ConversationHistoryScreen from '../screens/ConversationHistoryScreen';
import {userStore} from '../store/useStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useChatStore} from '../store/useChatStore';

type DrawerBarContentProps = {
  navigation: DrawerContentComponentProps['navigation'];
};

const DrawerBarContent: FC<DrawerBarContentProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const {getChatHistory} = useChatStore(state => ({
    getChatHistory: state.getChatHistory,
  }));

  useEffect(() => {
    getChatHistory('cohere');
  }, [getChatHistory]);

  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        isDarkMode ? styles.darkBg : styles.lightBg,
      ]}>
      <ConversationHistoryScreen navigation={navigation} />
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

export default React.memo(DrawerBarContent);
