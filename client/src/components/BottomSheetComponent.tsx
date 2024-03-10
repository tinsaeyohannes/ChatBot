import React, {FC} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
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

type ImageUploadBottomSheetProps = {
  snapPoints: string[];
  handlePresentModalPress: () => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
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
}): React.JSX.Element => {
  // Render the component
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
            <Text>Text Models</Text>
            <TouchableOpacity style={styles.imageModels}>
              <Text>Chat GPT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageModels}>
              <Text>Gemini</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageModels}>
              <Text>Cohere</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Image Models</Text>
            {ImageModels.map(model => (
              <TouchableOpacity key={model.id} style={styles.imageModels}>
                <Text style={styles.modelName}>{model.name}</Text>
                {model.modelType === 'txt2img' ? (
                  <Text> Text To Image</Text>
                ) : (
                  <Text>Image To Image</Text>
                )}
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
    backgroundColor: '#35423f',
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
    backgroundColor: 'rgba(3,19,15, 0.2)',
    width: Dimensions.get('window').width - 20,
    height: hp(15),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelName: {
    fontSize: hp(4),
  },
});

export default BottomSheetComponent;
