import React, {FC} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {ImageModels} from '../constants/ImageModels';
import {TextModel} from '../constants/TextModels';
import ChatGptIcon from '../assets/icons/chatgpt-icon.svg';
import CohereIcon from '../assets/icons/cohere-icon.svg';
import GeminiIcon from '../assets/icons/google-gemini-icon.svg';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import {useChatStore} from '../store/useChatStore';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {ParamListBase} from '@react-navigation/native';
import {useImageStore} from '../store/useImageStore';

type ImageUploadBottomSheetProps = {
  snapPoints: string[];
  handlePresentModalPress: () => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  navigation: DrawerNavigationProp<ParamListBase>;
};

const CustomBackdrop = (
  props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
) => {
  return (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="close"
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      enableTouchThrough={false}
      opacity={0.7}
    />
  );
};

const BottomSheetComponent: FC<ImageUploadBottomSheetProps> = ({
  bottomSheetModalRef,
  navigation,
}): React.JSX.Element => {
  const {getChatHistory, emptyUserChat} = useChatStore(state => ({
    getChatHistory: state.getChatHistory,
    emptyUserChat: state.emptyUserChat,
  }));
  const {getAllImageHistories} = useImageStore(state => ({
    getAllImageHistories: state.getAllImageHistories,
  }));
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['60%']}
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        handleStyle={styles.handle}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        onDismiss={() => {
          bottomSheetModalRef.current?.dismiss();
        }}>
        <Text style={styles.title}>Select Model</Text>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.modelTitle}>Text Models</Text>
            {TextModel.map(model => (
              <TouchableOpacity
                key={model.id}
                style={styles.imageModels}
                onPress={async () => {
                  emptyUserChat();
                  bottomSheetModalRef.current?.dismiss();
                  useChatStore.setState({currentModel: model.endPoint});
                  getChatHistory(model.endPoint);
                }}>
                {model.name === 'ChatGPT' ? (
                  <ChatGptIcon width={45} height={45} />
                ) : model.name === 'Cohere' ? (
                  <CohereIcon width={45} height={45} />
                ) : (
                  <GeminiIcon width={45} height={45} />
                )}
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.modelType}>{model.modelType}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <Text style={styles.modelTitle}>Image Models</Text>
            {ImageModels.map(model => (
              <TouchableOpacity
                key={model.id}
                style={styles.imageModels}
                onPress={() => {
                  emptyUserChat();
                  bottomSheetModalRef.current?.dismiss();
                  useChatStore.setState({currentModel: model.provider});
                  useImageStore.setState({modelProvider: model.provider});
                  useImageStore.setState({
                    currentChat: {
                      _id: '',
                      modelName: model.name,
                      modelType: model.modelType,
                      provider: model.provider,
                      history: [],
                      chatName: '',
                    },
                  });
                  navigation.navigate('Image');
                  getAllImageHistories();
                }}>
                <ImageBackground
                  resizeMode="contain"
                  style={styles.modelBg}
                  source={{uri: model.backgroundImage}}>
                  <View style={styles.modelType}>
                    <Text style={styles.modelName}>{model.name}</Text>
                  </View>
                  <View style={styles.modelType}>
                    {model.modelType === 'txt2img' ? (
                      <Text style={styles.modelTypeText}> Text To Image</Text>
                    ) : (
                      <Text style={styles.modelTypeText}>Image To Image</Text>
                    )}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  handle: {
    height: hp(5),
  },
  handleIndicator: {
    borderRadius: 105,
    backgroundColor: '#fff',
    width: wp(13),
    height: hp(0.6),
  },
  bottomSheetBackground: {
    backgroundColor: '#101010',
    borderRadius: 20,
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  contentContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadButton: {
    margin: 10,
    backgroundColor: 'rgba(3,19,15, 0.2)',
    width: wp(40),
    height: hp(15),
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
  },
  imageModels: {
    margin: 10,
    backgroundColor: 'rgba(75,255,75, 0.2)',
    width: Dimensions.get('window').width - 20,
    height: hp(12),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 10,
  },
  modelTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#fff',
    margin: 10,
  },
  modelBg: {
    width: Dimensions.get('window').width - 20,
    height: hp(105),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelInfo: {},
  modelName: {
    fontSize: hp(3),
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Manrope-Bold',
  },
  modelType: {
    padding: 5,
    backgroundColor: 'rgba(3,19,15, 0.3)',
    borderRadius: 10,
    textAlign: 'center',
  },
  modelTypeText: {
    color: '#fff',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default React.memo(BottomSheetComponent);
