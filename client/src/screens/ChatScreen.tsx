import React, {useCallback, useEffect, useState, type FC} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {userStore} from '../store/useStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import type {ParamListBase} from '@react-navigation/native';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {ChatHistoryTypes} from '../types/useChatStoreTypes';
// import {useChatStore} from '../store/useChatStore';
import EventSource, {
  type CloseEvent,
  type ErrorEvent,
  type ExceptionEvent,
  type MessageEvent,
  type OpenEvent,
  type TimeoutEvent,
} from 'react-native-sse';
import {SERVER_API_KEY, BASE_URL} from '@env';
import 'react-native-url-polyfill/auto';

type ChatScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
  route: any;
};

interface ExtendedEventSource extends EventSource {
  onmessage?: (event: MessageEvent) => void;
  onopen?: (event: OpenEvent) => void;
  onclose?: (event: CloseEvent) => void;
  ontimeout?: (event: TimeoutEvent) => void;
  onerror?: (error: Event) => void;
}

const ChatScreen: FC<ChatScreenProps> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const chat: ChatHistoryTypes = route.params?.chat;
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const [userMessage, setUserMessage] = useState({
    sender: 'user',
    message: 'hi',
  });
  const [botResponse, setBotResponse] = useState<string>('');
  const [messages, setMessages] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  const newChat = useCallback(() => {
    setLoading(true);

    let newContent = '';
    const eventSource: ExtendedEventSource = new EventSource(
      `${BASE_URL}/new`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SERVER_API_KEY}`,
          connection: 'keep-alive',
        },
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.message,
        }),
        pollingInterval: 25000,
      },
    );

    const openListener = (event: OpenEvent) => {
      if (event.type === 'open') {
        console.log('Open SSE connection.');
        setLoading(false);
      } else {
        console.log('error while opening SSE connection.');
      }
    };

    const messageListener = (event: MessageEvent) => {
      if (event.data && event.data !== '[DONE]') {
        const newWord = JSON.parse(event.data);
        newContent = newContent + newWord;
        // console.log(newContent);
        setBotResponse(newContent);

        setMessages((prev: string) => prev + newWord);
      } else {
        setLoading(false);
        eventSource.close();
      }
    };

    const errorListener = (
      event: ErrorEvent | TimeoutEvent | ExceptionEvent,
    ) => {
      if ('data' in event) {
        console.error('Connection error:', event.data);
      } else if (event.type === 'error') {
        console.error('Connection error:', event.message);
      }
      setLoading(false);
      eventSource.close();
    };

    eventSource.addEventListener('open', openListener);
    eventSource.addEventListener('message', messageListener);
    eventSource.addEventListener('error', errorListener);

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  }, [userMessage.message]);

  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);
  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        isDarkMode ? styles.darkBg : styles.lightBg,
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <AntDesign
              name="menu-fold"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>

          <Text>New Chat</Text>

          <TouchableOpacity style={styles.headerButton}>
            <Feather
              name="plus"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{messages}</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Text style={styles.message}>AI: {botResponse}</Text>
        )}

        <ScrollView>
          {chat?.history.map(message => (
            <View style={styles.messageContainer} key={message._id}>
              <View style={styles.senderPicContainer}>
                <Image
                  source={
                    message.sender === 'user'
                      ? {
                          uri: 'https://i.pravatar.cc/300',
                        }
                      : require('../assets/icons/ai.png')
                  }
                  style={styles.senderPic}
                />
              </View>
              <View>
                <Text style={styles.senderName}>
                  {message.sender === 'user' ? 'You' : 'AI'}
                </Text>
                <Text style={styles.message}>{message.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View>
          <View style={styles.chatInputContainer}>
            <TextInput
              placeholder="Message"
              style={styles.inputField}
              onChangeText={msg =>
                setUserMessage({...userMessage, message: msg})
              }
            />

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                // newChat(userMessage, chat?._id);
                newChat();
                // fetchStreamMessage();
              }}>
              <Feather
                name="send"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#031C1A',
  },
  darkBg: {
    backgroundColor: '#101010',
  },
  lightBg: {
    backgroundColor: '#E5E5E5',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: hp(6),
    height: hp(6),
    margin: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'red',
  },
  senderPicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5E5',
    width: hp(7),
    height: hp(7),
    borderRadius: 50,
    margin: hp(1.5),
    overflow: 'hidden',
  },
  senderPic: {
    width: hp(6),
    height: hp(6),
    borderRadius: 50,
  },

  senderName: {
    fontWeight: 'bold',
    fontSize: hp(2.5),
    color: 'lightblue',
  },
  message: {
    fontSize: hp(2.5),
    width: wp(75),
    color: '#E5E5E5',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: hp(1),
    paddingHorizontal: hp(1),
    borderRadius: 50,
    backgroundColor: '#292929',
  },
  inputField: {
    width: wp(60),
    marginLeft: hp(1),
  },
});

export default ChatScreen;
