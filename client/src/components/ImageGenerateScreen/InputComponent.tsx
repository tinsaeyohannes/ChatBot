import React, {useState, type FC} from 'react';
import {ActivityIndicator, TextInput, type ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {
  DropdownAlertType,
  type DropdownAlertData,
} from 'react-native-dropdownalert';
import {
  launchImageLibrary,
  type ImagePickerResponse,
  type MediaType,
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useImageStore} from '../../store/useImageStore';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {userStore} from '../../store/useStore';

type InputComponentProps = {
  alert: (_data: DropdownAlertData) => Promise<DropdownAlertData>;
  setImgPreview: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: React.MutableRefObject<ScrollView | null>;
  loading: boolean;
};

const InputComponent: FC<InputComponentProps> = ({
  alert,
  setImgPreview,
  setLoading,
  scrollRef,
  loading,
}): React.JSX.Element => {
  const {isDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
  }));
  const {uploadImage, userMessage, setUserMessage, currentChat, generateImage} =
    useImageStore(state => ({
      uploadImage: state.uploadImage,
      userMessage: state.userMessage,
      setUserMessage: state.setUserMessage,
      currentChat: state.currentChat,
      generateImage: state.generateImage,
    }));
  const [base64, setBase64] = useState('');

  return (
    <LinearGradient
      start={{x: 1, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.linearGradient}
      colors={['#03130F00', '#081814', '#03130F']}>
      {currentChat.modelType === 'img2img' ? (
        <View style={styles.imagePreviewContainer}>
          <View style={styles.promptInputContainer}>
            <TextInput
              value={userMessage}
              placeholder="Prompt: (optional)"
              placeholderTextColor="gray"
              style={styles.inputField}
              onChangeText={msg => setUserMessage(msg)}
            />
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
              <FontAwesome name="file-image-o" size={24} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.uploadImageButton}
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
            <FontAwesome name="cloud-upload" size={24} />
            <Text style={styles.selectImageText}>Upload Image</Text>
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
              style={styles.sendButton}
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
  );
};

const styles = StyleSheet.create({
  promptInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderRadius: 10,
    backgroundColor: '#292929',
  },
  selectImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: hp(7.4),
    width: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,

    backgroundColor: '#292929',
  },
  uploadImageButton: {
    height: hp(8),
    // marginHorizontal: hp(1.5),
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#292929',
    flexDirection: 'row',
    gap: 10,
  },
  selectImageText: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: 'bold',
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

  imagePreviewContainer: {
    marginHorizontal: wp(3),
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  sendButton: {
    width: hp(6),
    height: hp(6),
    margin: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#292929',
  },
});

export default InputComponent;
