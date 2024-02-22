import React from 'react';
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {userStore} from '../store/useStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ConversationHistoryScreen = (): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const truncateString = (str: string) => {
    if (str.length > 24) {
      return str.slice(0, 24) + '...';
    } else {
      return str;
    }
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity>
          <View style={styles.listItemContainer}>
            <Text
              style={[
                styles.text,
                isDarkMode ? styles.lightText : styles.darkText,
              ]}>
              {truncateString('List Item 1 Lorem ipsum dolor sit')}
            </Text>
            <Text
              style={[
                styles.dateText,
                isDarkMode ? styles.lightText : styles.darkText,
              ]}>
              3 min ago
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.listItemContainer}>
            <Text
              style={[
                styles.text,
                isDarkMode ? styles.lightText : styles.darkText,
              ]}>
              {truncateString('List Item 1 Lorem ipsum dolor sit')}
            </Text>
            <Text
              style={[
                styles.dateText,
                isDarkMode ? styles.lightText : styles.darkText,
              ]}>
              3 min ago
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: hp(2.2),
    width: '80%',
  },
  dateText: {
    fontSize: hp(1.5),
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

export default ConversationHistoryScreen;
