import React, {useEffect, useState, type FC} from 'react';
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
import type {
  ChatConversationTypes,
  ChatHistoryTypes,
} from '../types/useChatStoreTypes';
import {useChatStore} from '../store/useChatStore';
import 'react-native-url-polyfill/auto';
// import {SERVER_API_KEY, BASE_URL} from '@env';
// import RNEventSource from 'react-native-event-source';

type ChatScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
  route: any;
};

const ChatScreen: FC<ChatScreenProps> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const chat: ChatHistoryTypes = route.params?.chat;
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const {newChat, userChat} = useChatStore(state => ({
    newChat: state.newChat,
    userChat: state.userChat,
    continueChat: state.continueChat,
  }));
  const [userMessage, setUserMessage] = useState<ChatConversationTypes>({
    _id: new Date().toString(),
    sender: 'user',
    message: 'hi',
  });
  // const [botResponse, setBotResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  console.log('loading', loading);
  useEffect(() => {
    console.log('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // const toggleChat = () => {
  //   userChat.length === 0
  //     ? newChat(userMessage, setMessages, setLoading, chat?._id)
  //     : continueChat(userMessage, setMessages, setLoading, chat?._id);
  // };

  console.log('userUser', userChat);

  //   const url = new URL(`${BASE_URL}/stream`);

  //   const es = new RNEventSource(`${BASE_URL}/stream`, {
  //     headers: {
  //       Authorization: {
  //         toString: function () {
  //           return 'Bearer ' + SERVER_API_KEY;
  //         },
  //       },
  //     },
  //   });

  //   const listener = event => {
  //     if (event.type === 'open') {
  //       console.log('Open SSE connection.');
  //     } else if (event.type === 'message') {
  //       if (event.data && event.data !== '[DONE]') {
  //         const data = JSON.parse(event.data);
  //         console.log('data', data);
  //         setValue(prev => prev + data);
  //       } else {
  //         es.close(); // Close the connection to the server
  //       }
  //     } else if (event.type === 'error') {
  //       console.error('Connection error:', event.message);
  //       es.close();
  //     } else if (event.type === 'exception') {
  //       console.error('Error:', event.message, event.error);
  //     }
  //   };

  //   es.addEventListener('open', listener);
  //   es.addEventListener('message', listener);
  //   es.addEventListener('error', listener);

  //   return () => {
  //     es.removeAllListeners();
  //     es.close();
  //   };
  // }, []);
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

          <Text>{newChat.length === 0 ? 'New Chat' : chat?.chatName}</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              useChatStore.setState({userChat: []});
            }}>
            <Feather
              name="plus"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {chat
            ? chat?.history.map(message => (
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
              ))
            : userChat.map(message => (
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
                // toggleChat();
                newChat(userMessage, setLoading, chat?._id);
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
    backgroundColor: '#006570',
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
