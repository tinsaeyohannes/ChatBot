import React, {useEffect, type FC} from 'react';
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

type ChatScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
};

const ChatScreen: FC<ChatScreenProps> = ({navigation}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  useEffect(() => {
    console.log('isDarkMode', isDarkMode);
  }, [isDarkMode]);

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

        <ScrollView>
          <View style={styles.messageContainer}>
            <View style={styles.senderPicContainer}>
              <Image
                source={{
                  uri: 'https://i.pravatar.cc/300',
                }}
                style={styles.senderPic}
              />
            </View>
            <View>
              <Text style={styles.senderName}>You</Text>
              <Text>Hi There!</Text>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <View style={styles.senderPicContainer}>
              <Image
                source={require('../assets/icons/ai.png')}
                style={styles.senderPic}
              />
            </View>
            <View>
              <Text style={styles.senderName}>AI</Text>
              <Text style={styles.message}>
                🙄 Oh, hey there... how thrilling to see you 🙄
              </Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <View style={styles.chatInputContainer}>
            <TextInput placeholder="Message" style={styles.inputField} />

            <TouchableOpacity style={styles.headerButton}>
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
  },
  message: {
    fontSize: hp(2),
    width: wp(60),
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
  },
});

export default ChatScreen;
