import React, {FC} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

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
            <TouchableOpacity>
              <Text>Chat GPT</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Gemini</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Cohere</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Image Models</Text>
            <TouchableOpacity>
              <Text>DALL-E</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Stable Diffusion XL Lightning</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Fast Image</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Stable DiffusionXL</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Stable Cascade</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Esrgan Upscale</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Supir Upscaler</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>CCSRUpscaler</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Face Retoucher</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Creative Upscaler</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Remove Background</Text>
            </TouchableOpacity>
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
});

export default BottomSheetComponent;
