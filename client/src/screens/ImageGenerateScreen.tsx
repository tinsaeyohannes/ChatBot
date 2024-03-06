import React, {useState} from 'react';
import {Button, StyleSheet, Text} from 'react-native';
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
import {Image} from 'react-native';
import {useImageStore} from '../store/useImageStore';
const ImageGenerateScreen = (): React.JSX.Element => {
  const {uploadImage} = useImageStore(state => ({
    uploadImage: state.uploadImage,
  }));
  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>(res => res);

  const [image, setImage] = useState('');
  const [base64, setBase64] = useState('');
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Text>ImageGenerateScreen</Text>
      {image && <Image source={{uri: image}} style={styles.image} />}
      <Button
        title="Launch Image Library"
        onPress={() =>
          launchImageLibrary(
            {
              mediaType: 'photo' as MediaType,
              assetRepresentationMode: 'auto',
              includeBase64: true,
              //   quality: 0.7,
              //   maxWidth: 500,
              //   maxHeight: 500,
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
                  const asset = response.assets[0].uri;
                  const base64Image = response.assets[0].base64;
                  setImage(asset as string);
                  setBase64(base64Image as string);
                }
              } catch (error) {
                console.error(error);
              }
            },
          )
        }
      />
      <Button title="Upload Image" onPress={() => uploadImage(base64)} />
      <DropdownAlert alert={func => (alert = func)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginVertical: 20,
  },
});

export default ImageGenerateScreen;
