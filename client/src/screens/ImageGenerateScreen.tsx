import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  launchImageLibrary,
  type ImagePickerResponse,
  type MediaType,
} from 'react-native-image-picker';
import DropdownAlert, {
  DropdownAlertType,
  type DropdownAlertData,
} from 'react-native-dropdownalert';
import FastImage from 'react-native-fast-image';

import {useImageStore} from '../store/useImageStore';
import {CompareSliderComponent} from '../components/ImageGenerateScreen/CompareSliderComponent';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import type {ParamListBase} from '@react-navigation/native';
import type {BottomSheetModal} from '@gorhom/bottom-sheet';
import type {ImagesHistoryTypes} from '../types/useImageStoreTypes';
import {userStore} from '../store/useStore';
import BottomSheetComponent from '../components/BottomSheetComponent';
import ChatGptIcon from '../assets/icons/chatgpt-icon.svg';
import CohereIcon from '../assets/icons/cohere-icon.svg';
import GeminiIcon from '../assets/icons/google-gemini-icon.svg';
import {format} from 'date-fns';
import {useChatStore} from '../store/useChatStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ImageGenerateScreenProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
  route: any;
};

const ImageGenerateScreen: FC<ImageGenerateScreenProps> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const chat: ImagesHistoryTypes = route.params?.chat;

  const {currentModel} = useChatStore(state => ({
    currentModel: state.currentModel,
  }));
  const {
    uploadImage,
    userMessage,
    setUserMessage,
    currentChat,
    generateImage,
    modelProvider,
  } = useImageStore(state => ({
    uploadImage: state.uploadImage,
    userMessage: state.userMessage,
    setUserMessage: state.setUserMessage,
    currentChat: state.currentChat,
    generateImage: state.generateImage,
    modelProvider: state.modelProvider,
  }));
  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>(res => res);

  const [imgPreview, setImgPreview] = useState('');
  const [base64, setBase64] = useState('');

  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const scrollRef = useRef<ScrollView | null>(null);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    console.log('isDarkMode', isDarkMode);
    console.log('loading', loading);
    console.log('modelProvider', modelProvider);
  }, [isDarkMode, loading, modelProvider]);

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
  useEffect(() => {
    console.log('chat', chat);
    console.log('currentChat', currentChat);
  }, [chat, currentChat]);
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
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

          <Text>{currentChat?.modelName}</Text>

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
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {currentChat &&
            currentChat.history &&
            currentChat.history.map(message => (
              <View style={styles.messageContainer} key={message._id}>
                <View style={styles.senderPicContainer}>
                  {message.sender === 'user' ? (
                    <FastImage
                      source={{
                        uri: 'https://i.pravatar.cc/300',
                      }}
                      style={styles.senderPic}
                    />
                  ) : currentChat.modelName === 'ChatGPT' ? (
                    <ChatGptIcon />
                  ) : currentChat.modelName === 'Cohere' ? (
                    <CohereIcon />
                  ) : (
                    <GeminiIcon />
                  )}
                </View>
                <View style={styles.messageTextContainer}>
                  <Text style={styles.senderName}>
                    {message.sender === 'user' ? 'You' : currentChat?.modelName}
                  </Text>
                  <Text style={styles.message}>
                    {message.sender === 'user' && message.prompt}
                  </Text>
                </View>
                {message.sender !== 'user' && (
                  <View style={styles.imageContainer}>
                    {currentChat.modelType === 'txt2img' ? (
                      <FastImage
                        source={{uri: message.generated_Image}}
                        style={styles.image}
                      />
                    ) : (
                      <>
                        {imgPreview ? (
                          <FastImage
                            source={{uri: imgPreview}}
                            style={styles.image}
                          />
                        ) : (
                          <CompareSliderComponent
                            sliderStyles={{width: 200, height: 200}}
                            before={
                              <FastImage
                                source={{
                                  uri: message.original_Image,
                                }}
                                resizeMode="cover"
                                style={styles.image}
                              />
                            }
                            after={
                              <FastImage
                                source={{
                                  uri: message.generated_Image,
                                }}
                                resizeMode="cover"
                                style={styles.image}
                              />
                            }
                            containerSize={{
                              width: 300,
                              height: 350,
                            }}
                            showSeparationLine={true}
                          />
                        )}
                      </>
                    )}
                  </View>
                )}

                <Text style={styles.date}>
                  {message.createdAt
                    ? format(message?.createdAt, 'mm:ss')
                    : format(new Date(), 'mm:ss')}
                </Text>
              </View>
            ))}
          {generating && (
            <View style={styles.messageContainer}>
              <View style={styles.senderPicContainer}>
                {currentModel === 'openai' ? (
                  <ChatGptIcon width={35} height={35} />
                ) : currentModel === 'cohere' ? (
                  <CohereIcon width={35} height={35} />
                ) : (
                  <GeminiIcon width={35} height={35} />
                )}
              </View>
              <View>
                <Text style={styles.senderName}>{currentChat.modelName}</Text>
                <Text selectable style={styles.message}>
                  Generating...
                </Text>
              </View>
            </View>
          )}
          {currentChat.modelType === 'img2img' && imgPreview && (
            <>
              <View style={styles.imageContainer}>
                <FastImage source={{uri: imgPreview}} style={styles.image} />
              </View>
            </>
          )}
        </ScrollView>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.linearGradient}
          colors={['#03130F00', '#081814', '#03130F']}>
          {currentChat.modelType === 'img2img' ? (
            <View style={styles.imagePreviewContainer}>
              <View style={styles.chatInputContainer}>
                <TextInput
                  value={userMessage}
                  placeholder="Prompt: (optional)"
                  placeholderTextColor="gray"
                  style={styles.inputField}
                  onChangeText={msg => setUserMessage(msg)}
                />
              </View>
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={() =>
                  launchImageLibrary(
                    {
                      mediaType: 'photo' as MediaType,
                      assetRepresentationMode: 'auto',
                      includeBase64: true,
                    },
                    async (response: ImagePickerResponse) => {
                      try {
                        if (!response.assets) {
                          // Log an error if no assets are returned from the image picker
                          console.log('ImagePicker Error: No assets returned');
                          await alert({
                            type: DropdownAlertType.Error,
                            title: 'ERROR',
                            message: 'No assets returned',
                            interval: 3000,
                          });
                        } else {
                          const base64Image = response.assets[0].base64;
                          setBase64(base64Image as string);
                          setImgPreview(response.assets[0].uri as string);
                        }
                      } catch (error) {
                        throw new Error(error as string);
                      }
                    },
                  )
                }>
                <Text style={styles.selectImageText}>Select FastImage</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={async () => {
                  if (!base64) {
                    console.log('No image to upload');
                    return;
                  }
                  useImageStore.setState({model: currentChat?.modelName});
                  await uploadImage(base64, userMessage, setLoading, scrollRef);

                  setUserMessage('');
                  setImgPreview('');
                  setBase64('');
                }}>
                <Text style={styles.selectImageText}>Upload FastImage</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.chatInputContainer}>
              <TextInput
                value={userMessage}
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
                  onPress={async () => {
                    useImageStore.setState({model: currentChat?.modelName});

                    await generateImage(userMessage, setLoading, scrollRef);

                    setUserMessage('');
                  }}>
                  <Feather
                    name="send"
                    size={24}
                    color={isDarkMode ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </LinearGradient>
      </View>

      <DropdownAlert alert={func => (alert = func)} />

      <BottomSheetComponent
        navigation={navigation}
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        handlePresentModalPress={handlePresentModalPress}
      />
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
    backgroundColor: '#292929',
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
    aspectRatio: 16 / 9,
    width: hp(5),
    height: hp(5),
    borderRadius: 50,
  },
  messageTextContainer: {
    flexDirection: 'column',
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
    fontFamily: 'open-sans',
    width: wp(75),
    color: '#E5E5E5',
  },

  selectImageButton: {
    height: hp(8),
    marginHorizontal: hp(1.5),
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#292929',
  },
  selectImageText: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: 'bold',
  },
  date: {
    fontSize: hp(1.8),
    fontFamily: 'open-sans',
    width: wp(75),
    color: 'gray',
    textAlign: 'right',
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
    // flexDirection: 'row',
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
    width: wp(70),
    marginLeft: hp(1),
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    marginHorizontal: wp(3),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
  },
});

export default React.memo(ImageGenerateScreen);
