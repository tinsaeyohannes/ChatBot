import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {ParamListBase} from '@react-navigation/native';
import React, {type FC} from 'react';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {StyleSheet, Text} from 'react-native';
import {
  //   widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {userStore} from '../../store/useStore';
import {useImageStore} from '../../store/useImageStore';
type HeaderComponentProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
  handlePresentModalPress: () => void;
};

const HeaderComponent: FC<HeaderComponentProps> = ({
  navigation,
  handlePresentModalPress,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));

  const {currentChat} = useImageStore(state => ({
    currentChat: state.currentChat,
  }));

  return (
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

      <Text style={styles.headerTitle}>{currentChat?.modelName}</Text>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={handlePresentModalPress}>
        <AntDesign
          name="appstore-o"
          size={24}
          color={isDarkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: hp(2.5),
    color: 'white',
  },
  headerButton: {
    width: hp(6),
    height: hp(6),
    margin: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#292929',
  },
});

export default HeaderComponent;
