import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import {Keyboard, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DropdownAlert, {
  type DropdownAlertData,
} from 'react-native-dropdownalert';
import {useImageStore} from '../store/useImageStore';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {ParamListBase} from '@react-navigation/native';
import type {BottomSheetModal} from '@gorhom/bottom-sheet';
import type {ImagesHistoryTypes} from '../types/useImageStoreTypes';
import {userStore} from '../store/useStore';
import BottomSheetComponent from '../components/BottomSheetComponent';
import HeaderComponent from '../components/ImageGenerateScreen/HeaderComponent';
import ScrollViewComponent from '../components/ImageGenerateScreen/ScrollViewComponent';
import InputComponent from '../components/ImageGenerateScreen/InputComponent';

type ImageGenerateScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
  route: any;
};

const ImageGenerateScreen: FC<ImageGenerateScreenProps> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const chat: ImagesHistoryTypes = route.params?.chat;

  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>(res => res);

  const [imgPreview, setImgPreview] = useState('');

  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const scrollRef = useRef<ScrollView | null>(null);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (chat) {
      useImageStore.setState({currentChat: chat});
    }
  }, [chat]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (loading) {
        setGenerating(true);
      } else {
        setGenerating(false);
      }
    }, 500);

    if (!loading) {
      setGenerating(false);
    }
  }, [generating, loading]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.mainContainer}>
        <HeaderComponent
          navigation={navigation}
          handlePresentModalPress={handlePresentModalPress}
        />
        <ScrollViewComponent
          imgPreview={imgPreview}
          scrollRef={scrollRef}
          generating={generating}
        />
        <InputComponent
          scrollRef={scrollRef}
          setImgPreview={setImgPreview}
          setLoading={setLoading}
          alert={alert}
          loading={loading}
        />
      </View>

      <DropdownAlert alert={func => (alert = func)} />

      <BottomSheetComponent
        navigation={navigation}
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        handlePresentModalPress={handlePresentModalPress}
        setLoading={setLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#031C1A',
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default React.memo(ImageGenerateScreen);
