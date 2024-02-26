import React, {useEffect, type FC} from 'react';
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
import {formatDistanceToNow} from 'date-fns';
import type {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';

type ConversationHistoryScreenProps = {
  navigation: DrawerNavigationHelpers;
};

const ConversationHistoryScreen: FC<ConversationHistoryScreenProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const {conversationHistory} = useChatStore(state => ({
    conversationHistory: state.conversationHistory,
  }));

  // useEffect(() => {
  //   console.log('conversationHistory useEffect', conversationHistory);
  //   console.log(
  //     'history useEffect',
  //     conversationHistory.map(item => item.history),
  //   );
  // }, [conversationHistory]);

  const truncateString = (str: string) => {
    if (str?.length > 34) {
      return str.slice(0, 30) + '...';
    } else {
      return str;
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, {addSuffix: true});
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
          <TextInput placeholder="Search" style={styles.inputField} />
        </View>
      </View>
      <FlatList
        data={conversationHistory || []}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              const chat = item;
              navigation.navigate('Chat', {chat});
            }}>
            <View style={styles.listItemContainer}>
              <Text
                style={[
                  styles.text,
                  isDarkMode ? styles.lightText : styles.darkText,
                ]}>
                {truncateString(item?.chatName)}
              </Text>
              <Text style={[styles.dateText]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileButton}>
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
    // flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
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
  scrollViewContainer: {
    flexGrow: 3,
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
