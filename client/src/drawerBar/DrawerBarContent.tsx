import React, {useEffect, type FC} from 'react';
import {type DrawerContentComponentProps} from '@react-navigation/drawer';
import {StyleSheet} from 'react-native';
import ConversationHistoryScreen from '../screens/ConversationHistoryScreen';
import {userStore} from '../store/useStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useChatStore} from '../store/useChatStore';
import {useImageStore} from '../store/useImageStore';

type DrawerBarContentProps = {
  navigation: DrawerContentComponentProps['navigation'];
};

const DrawerBarContent: FC<DrawerBarContentProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const {getChatHistory, currentModel} = useChatStore(state => ({
    getChatHistory: state.getChatHistory,
    currentModel: state.currentModel,
  }));

  const {getAllImageHistories} = useImageStore(state => ({
    getAllImageHistories: state.getAllImageHistories,
  }));

  // This useEffect hook runs when the currentModel, getAllImageHistories, getChatHistory, or navigation changes
  useEffect(() => {
    // If the currentModel is 'openai', 'cohere', or 'gemini', then get chat history for that model and navigate to the 'Chat' screen
    if (currentModel) {
      if (
        currentModel === 'openai' ||
        currentModel === 'cohere' ||
        currentModel === 'gemini'
      ) {
        getChatHistory(currentModel);
        navigation.navigate('Chat');
      } else {
        // If the currentModel is not 'openai', 'cohere', or 'gemini', then get all image histories and navigate to the 'Image' screen
        getAllImageHistories();
        navigation.navigate('Image');
      }
    } else {
      useChatStore.setState({currentModel: 'openai'});
      navigation.navigate('Chat');
      getChatHistory(currentModel);
    }
  }, [currentModel, getAllImageHistories, getChatHistory, navigation]);

  console.log('currentModel', currentModel);

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
