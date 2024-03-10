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

type ConversationHistoryScreenProps = {
  navigation: DrawerNavigationHelpers;
};

const ConversationHistoryScreen: FC<ConversationHistoryScreenProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const {conversationHistory, userChat, setUserMessage} = useChatStore(
    state => ({
      conversationHistory: state.conversationHistory,
      userChat: state.userChat,
      setUserMessage: state.setUserMessage,
    }),
  );

  const [searchText, setSearchText] = useState<string>('');
  const [chatIndex, setChatIndex] = useState<number | null>(0);

  const [updatedConversationHistory, setUpdatedConversationHistory] =
    useState(conversationHistory);

  useEffect(() => {
    if (searchText === '') {
      setUpdatedConversationHistory(conversationHistory);
    } else {
      setUpdatedConversationHistory(
        conversationHistory.filter(
          item =>
            item?.chatName?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.history
              ?.map(itm => itm.message)
              .join(' ')
              .toLowerCase()
              .includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [conversationHistory, searchText]);

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
        <View>
          <TouchableOpacity
            style={styles.newChatContainer}
            onPress={() => {
              useChatStore.setState({
                userChat: {
                  _id: '',
                  history: [],
                  chatName: '',
                },
              });
              setUserMessage('');
              navigation.navigate('Chat');
            }}>
            <Text style={styles.newChat}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={updatedConversationHistory || []}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <>
            <TouchableOpacity
              onPress={() => {
                const chat = item;
                useChatStore.setState({
                  userChat: {
                    _id: '',
                    history: [],
                    chatName: '',
                  },
                });
                navigation.navigate('Chat', {chat});
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
                <Text
                  style={[
                    styles.text,
                    isDarkMode ? styles.lightText : styles.darkText,
                  ]}>
                  {truncateString(item?.chatName, 28)}
                </Text>
                <Text style={[styles.dateText]}>
                  {item.createdAt ? formatDate(item.createdAt) : ''} ago
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        ListFooterComponent={
          updatedConversationHistory.length > 9 ? showMoreButton : null
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
  text: {
    fontSize: hp(2.2),
    width: '95%',
  },
  dateText: {
    fontSize: hp(1.5),
    color: 'gray',
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#fff',
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
