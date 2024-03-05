import React, {type FC} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {userStore} from '../store/useStore';
import type {ParamListBase} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  // widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ProfileScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
};
const ProfileScreen: FC<ProfileScreenProps> = ({
  navigation,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        isDarkMode ? styles.darkBg : styles.lightBg,
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign
            name="left"
            size={24}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>

        <Text>Settings</Text>

        <Button
          title="image"
          onPress={() => {
            navigation.navigate('Image');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#031C1A',
  },
  lightBg: {
    backgroundColor: '#E5E5E5',
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
});

export default React.memo(ProfileScreen);
