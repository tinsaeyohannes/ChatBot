import React, {useEffect, useRef, useState, type FC} from 'react';
import {
  ActivityIndicator,
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
import {useChatStore} from '../store/useChatStore';
import 'react-native-url-polyfill/auto';
import {truncateString} from '../helper/truncateString';
import DropdownAlert, {
  type DropdownAlertData,
} from 'react-native-dropdownalert';
import LinearGradient from 'react-native-linear-gradient';
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
  const scrollRef = useRef<ScrollView | null>(null);
  const {newChat, userChat} = useChatStore(state => ({
    newChat: state.newChat,
    userChat: state.userChat,
  }));
  const [userMessage, setUserMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  useEffect(() => {
    console.log('isDarkMode', isDarkMode);
    console.log('loading', loading);
  }, [isDarkMode, loading]);

  console.log('userUser', userChat);

  useEffect(() => {
    if (chat) {
      useChatStore.setState({userChat: chat});
    }
  }, [chat]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
  }, []);
  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>(res => res);

  useEffect(() => {
    setTimeout(() => {
      if (loading) {
        setBotTyping(true);
      }
    }, 500);

    if (!loading) {
      setBotTyping(false);
    }
  }, [loading]);

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

          <Text>
            {newChat.length === 0
              ? truncateString(chat?.chatName, 10) || 'New Chat'
              : null}
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              useChatStore.setState({
                userChat: {
                  _id: '',
                  history: [],
                  chatName: '',
                },
              });
              setUserMessage('');
            }}>
            <Feather
              name="plus"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {userChat &&
            userChat.history &&
            userChat.history.map(message => (
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
                  <Text selectable style={styles.message}>
                    {message.message}
                  </Text>
                </View>
              </View>
            ))}
          {botTyping && (
            <View style={styles.messageContainer}>
              <View style={styles.senderPicContainer}>
                <Image
                  source={require('../assets/icons/ai.png')}
                  style={styles.senderPic}
                />
              </View>
              <View>
                <Text style={styles.senderName}>AI</Text>
                <Text selectable style={styles.message}>
                  Typing...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.linearGradient}
          colors={['#03130F00', '#081814', '#03130F']}>
          <View style={styles.chatInputContainer}>
            <TextInput
              placeholder="Message"
              placeholderTextColor={isDarkMode ? 'white' : 'black'}
              style={styles.inputField}
              onChangeText={msg => setUserMessage(msg)}
            />
            {loading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  newChat(
                    userMessage,
                    setLoading,
                    userChat?._id ?? '',
                    scrollRef,
                    alert,
                  );
                }}>
                <Feather
                  name="send"
                  size={24}
                  color={isDarkMode ? 'white' : 'black'}
                />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
      <DropdownAlert alert={func => (alert = func)} />
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
    width: hp(5),
    height: hp(5),
    borderRadius: 50,
    margin: hp(1.5),
    overflow: 'hidden',
  },
  senderPic: {
    width: hp(5),
    height: hp(5),
    borderRadius: 50,
  },

  senderName: {
    fontWeight: 'bold',
    fontSize: hp(2.5),
    color: 'lightblue',
  },
  darkText: {
    color: 'dark',
  },
  message: {
    fontSize: hp(2.5),
    fontFamily: 'Open-Sans',
    width: wp(75),
    color: '#E5E5E5',
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(15),
    justifyContent: 'flex-end',
  },
  scrollViewContainer: {
    paddingBottom: hp(15),
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

export default React.memo(ChatScreen);
