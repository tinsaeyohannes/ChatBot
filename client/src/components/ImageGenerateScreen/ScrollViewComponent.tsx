import React, {type FC} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CompareSliderComponent} from './CompareSliderComponent';
import ChatGptIcon from '../../assets/icons/chatgpt-icon.svg';
import CohereIcon from '../../assets/icons/cohere-icon.svg';
import GeminiIcon from '../../assets/icons/google-gemini-icon.svg';
import {format} from 'date-fns';
import {useChatStore} from '../../store/useChatStore';
import {useImageStore} from '../../store/useImageStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ScrollViewComponentProps = {
  scrollRef: React.MutableRefObject<ScrollView | null>;
  imgPreview: string;
  generating: boolean;
};

const ScrollViewComponent: FC<ScrollViewComponentProps> = ({
  scrollRef,
  imgPreview,
  generating,
}): React.JSX.Element => {
  const {currentModel} = useChatStore(state => ({
    currentModel: state.currentModel,
  }));

  const {currentChat} = useImageStore(state => ({
    currentChat: state.currentChat,
  }));

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContainer}>
      {currentChat &&
        currentChat.history &&
        currentChat.history.map(message => (
          <View style={styles.messageContainer} key={message._id}>
            <View style={styles.senderContainer}>
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
                    {!message.original_Image && !message.generated_Image ? (
                      <FastImage
                        source={{uri: imgPreview}}
                        style={styles.image}
                      />
                    ) : (
                      <CompareSliderComponent
                        sliderStyles={styles.imageCompare}
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
  );
};

const styles = StyleSheet.create({
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderPicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E5E5E5',
    width: hp(5),
    height: hp(5),
    borderRadius: 50,
    margin: hp(1.5),
    overflow: 'hidden',
  },

  senderPic: {
    // aspectRatio: 16 / 9,
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

  message: {
    fontSize: hp(2.5),
    fontFamily: 'open-sans',
    width: wp(75),
    color: '#E5E5E5',
  },

  date: {
    fontSize: hp(1.8),
    fontFamily: 'open-sans',
    width: wp(75),
    color: 'gray',
    textAlign: 'right',
  },

  scrollViewContainer: {
    paddingBottom: hp(15),
  },
  messageContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
  },

  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('screen').width - 20,
    height: hp(45),
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
  },
  imageCompare: {
    width: wp(70),
    height: hp(40),
  },
});

export default ScrollViewComponent;
