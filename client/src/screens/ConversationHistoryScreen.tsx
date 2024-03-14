import React, {useEffect, useState, type FC} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {userStore} from '../store/useStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useChatStore} from '../store/useChatStore';
import type {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {truncateString} from '../helper/truncateString';
import {formatDate} from '../helper/formatDate';
import ChatGptIcon from '../assets/icons/chatgpt-icon.svg';
import CohereIcon from '../assets/icons/cohere-icon.svg';
import GeminiIcon from '../assets/icons/google-gemini-icon.svg';
import {useImageStore} from '../store/useImageStore';
import type {ChatHistoryTypes} from '../types/useChatStoreTypes';
import type {ImagesHistoryTypes} from '../types/useImageStoreTypes';

type ConversationHistoryScreenProps = {
  navigation: DrawerNavigationHelpers;
};

type CombinedHistoryTypes = ChatHistoryTypes | ImagesHistoryTypes;

const ConversationHistoryScreen: FC<ConversationHistoryScreenProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const {
    conversationHistory,
    userChat,
    setUserMessage,
    emptyUserChat,
    currentModel,
  } = useChatStore(state => ({
    conversationHistory: state.conversationHistory,
    userChat: state.userChat,
    setUserMessage: state.setUserMessage,
    emptyUserChat: state.emptyUserChat,
    currentModel: state.currentModel,
  }));
  const {imagesHistory} = useImageStore(state => ({
    imagesHistory: state.imagesHistory,
  }));

  const [searchText, setSearchText] = useState<string>('');
  const [chatIndex, setChatIndex] = useState<number | null>(0);
  const [updatedConversationHistory, setUpdatedConversationHistory] = useState<
    ChatHistoryTypes[] | ImagesHistoryTypes[]
  >([]);

  useEffect(() => {
    if (
      currentModel === 'openai' ||
      currentModel === 'cohere' ||
      currentModel === 'gemini'
    ) {
      if (searchText === '') {
        setUpdatedConversationHistory(
          conversationHistory as ChatHistoryTypes[],
        );
      } else {
        setUpdatedConversationHistory(
          conversationHistory.filter(
            item =>
              item?.chatName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item?.history
                ?.map(itm => itm.message)
                .join(' ')
                .toLowerCase()
                .includes(searchText.toLowerCase()),
          ),
        );
      }
    } else {
      if (searchText === '') {
        setUpdatedConversationHistory(imagesHistory as ImagesHistoryTypes[]);
      } else {
        setUpdatedConversationHistory(
          imagesHistory.filter(
            item =>
              item?.chatName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item?.history
                ?.map(itm => itm.prompt)
                .join(' ')
                .toLowerCase()
                .includes(searchText.toLowerCase()),
          ),
        );
      }
    }
  }, [conversationHistory, currentModel, imagesHistory, searchText]);

  // useEffect(() => {
  //   console.log('updatedConversationHistory', updatedConversationHistory);
  // }, [updatedConversationHistory]);

  const showMoreButton = () => {
    return (
      <TouchableOpacity style={styles.showMoreButton}>
        <Text style={styles.showMoreButtonText}>Show More</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.safeAreaViewContainer}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.upperContainer}>
        <View style={[styles.searchContainer, !isDarkMode && styles.lightBg]}>
          <FontAwesome name="search" size={20} color={'gray'} />
          <TextInput
            placeholder="Search"
            style={styles.inputField}
            onChangeText={setSearchText}
          />
        </View>
        <View style={styles.newChatContainer}>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              if (
                currentModel === 'ChatGPT' ||
                currentModel === 'Cohere' ||
                currentModel === 'Gemini'
              ) {
                emptyUserChat();

                navigation.navigate('Chat');
              } else {
                useImageStore.setState({
                  currentChat: {
                    _id: '',
                    modelName: '',
                    modelType: '',
                    provider: '',
                    history: [],
                    chatName: '',
                  },
                });
                navigation.navigate('Image');
              }
              setUserMessage('');
            }}>
            <Text style={styles.newChat}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={updatedConversationHistory as CombinedHistoryTypes[]}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <>
            <TouchableOpacity
              onPress={() => {
                const chat = item;
                emptyUserChat();

                console.log('chat conversation', chat);

                if (
                  chat.modelName === 'ChatGPT' ||
                  chat.modelName === 'Cohere' ||
                  chat.modelName === 'Gemini'
                ) {
                  navigation.navigate('Chat', {chat});
                } else {
                  navigation.navigate('Image', {chat});
                }

                if (!userChat) {
                  setChatIndex(null);
                } else {
                  setChatIndex(index);
                }
              }}
              onLongPress={() => {
                console.log('touchedIndex - ', index);
              }}>
              <View
                style={[
                  styles.listItemContainer,
                  chatIndex === index && styles.selectedListItem,
                ]}>
                <View style={styles.listItem}>
                  {item.modelName === 'dalle' ? (
                    <Image
                      source={require('../assets/icons/dalle.png')}
                      style={styles.aiIcon}
                    />
                  ) : item.modelName === 'fal' ? (
                    <Image
                      style={styles.aiIcon}
                      source={require('../assets/icons/fal.png')}
                    />
                  ) : item?.modelName === 'ChatGPT' ? (
                    <ChatGptIcon width={25} height={25} />
                  ) : item.modelName === 'Cohere' ? (
                    <CohereIcon width={24} height={24} />
                  ) : (
                    <GeminiIcon width={24} height={24} />
                  )}
                  <View>
                    <Text
                      style={[
                        styles.text,
                        isDarkMode ? styles.lightText : styles.darkText,
                      ]}>
                      {truncateString(item?.chatName, 28)}
                    </Text>
                    <Text style={styles.modelText}>{item.modelName}</Text>
                  </View>
                </View>

                <Text style={[styles.dateText]}>
                  {item?.createdAt && formatDate(item?.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        ListFooterComponent={
          updatedConversationHistory.length >= 10 ? showMoreButton : null
        }
      />

      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Image
            source={{uri: 'https://picsum.photos/200/300'}}
            style={styles.profileImage}
          />
          <Text
            style={[
              styles.profileName,
              isDarkMode ? styles.lightText : styles.darkText,
            ]}>
            John Doe
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
  listItemContainer: {
    margin: 15,
    justifyContent: 'space-between',
  },
  selectedListItem: {
    backgroundColor: '#4A4A4A',
    borderColor: 'gray',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIcon: {
    width: 25,
    height: 25,
  },
  text: {
    fontSize: hp(2.2),
  },
  dateText: {
    fontSize: hp(1.5),
    color: 'gray',
    textAlign: 'right',
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#fff',
  },
  modelText: {
    color: 'gray',
  },
  upperContainer: {
    minHeight: hp(10),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    backgroundColor: '#292929',
  },
  lightBg: {
    backgroundColor: '#616161',
  },
  inputField: {
    width: wp(60),
  },
  newChatContainer: {
    paddingBottom: 10,
  },
  newChatButton: {
    backgroundColor: '#292929',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  newChat: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
  },
  scrollViewContainer: {
    flexGrow: 3,
  },
  showMoreButton: {
    backgroundColor: '#292929',
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  showMoreButtonText: {
    fontSize: hp(2),
    color: 'white',
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
  },
  profileContainer: {
    minHeight: 90,
    borderColor: 'gray',
    borderTopWidth: 1,
    padding: 15,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: 'white',
  },
});

export default React.memo(ConversationHistoryScreen);
