import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChatScreen = (): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Text>ChatScreen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
