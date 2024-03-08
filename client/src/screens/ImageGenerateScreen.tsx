import React, {useState} from 'react';
import {Button, Image, StyleSheet} from 'react-native';
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

import {useImageStore} from '../store/useImageStore';
import {CompareSliderComponent} from '../components/ImageGenerateScreen/CompareSliderComponent';

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
      {/* {image && <Image source={{uri: image}} style={styles.image} />} */}
      {img && (
        <CompareSliderComponent
          sliderStyles={{width: 200, height: 200}}
          before={
            <Image
              source={{
                uri: 'https://res.cloudinary.com/da1msjzp1/image/upload/v1695063922/blog-app/6508965f1895a862f72b00e3/Thumbnails/ec507959956b7c7e61abd1d389dd3ccc.jpg',
              }}
              resizeMode="cover"
              style={styles.image}
            />
          }
          after={
            <Image
              source={{
                uri: 'https://storage.googleapis.com/isolate-dev-hot-rooster_toolkit_bucket/c90442a3d9394876a24b1204d0b71735.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gke-service-account%40isolate-dev-hot-rooster.iam.gserviceaccount.com%2F20240306%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240306T140219Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=2993a33fa985f0af717a95f06f759935fdb247cb4006674c9632662f5608eb2ce9e1ede52d45eb0824f18b440fc31935d4adbf4722f3aa2bf64c17c405da6ae2a81ce444fcf69d2b78d7422eafdf5c7b53d8962ef981a37a5bf08a61076c2ba6804432353d25a8ca60a4b4831c28bd2ee72ccadc5e138ec466665a48a2c622cbf98a6f3d6103a6cb1de3007eeb5da88ca4ac882a4876092bf52a40974d139007c866976b6905854b5e375b09a875d86296aaafcd4e3b5eccff4d3417d2ff97c534387bc12673c668ef49c2823bbc09f0a2203e5b5800715f7c3745fed97c45ade299825104671c4c1349d8b304804c8995cec170f2b0ac4875904b79f09d11a1',
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
      <Button
        title="Launch Image Library"
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
    width: 300,
    height: 300,
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
  },
});

export default ImageGenerateScreen;
