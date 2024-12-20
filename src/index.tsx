import React, { type FC, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
  useDerivedValue,
  scrollTo,
  useAnimatedRef,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
type ImageType = string | Buffer;
type Props = {
  showPaginationDots?: boolean;
  showCounter?: boolean;
  animation?: 'slide' | 'fadeIn';
  height?: number;
  images: ImageType[];
  autoPlayInterval?: number; // Auto-play interval in milliseconds
  animationDuration?: number; // Animation duration in milliseconds
  photoCounterTop?: number;
};

type SliderProps = {
  url: ImageType;
  index: number;
  scrollX: SharedValue<number>;
  animation?: 'slide' | 'fadeIn';
  items?: ImageType[];
  height?: number;
};

// Check image is remote file
const isRemoteImage = (image: string | Buffer): boolean => {
  // Convert the image to a string (if it's a Buffer)
  const imagePath = typeof image === 'string' ? image : image?.toString();

  // Check if it starts with "http" or "https"
  return imagePath.startsWith('http://') || imagePath.startsWith('https://');
};

const SliderItem: FC<SliderProps> = ({
  url,
  scrollX,
  index,
  animation,
  height,
}) => {
  const slideStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-width * 0.25, 0, width * 0.25],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX }, { scale }, { perspective: 500 }],
    };
  });

  const fadeInStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const animationStyles = animation === 'fadeIn' ? fadeInStyles : slideStyles;
  const uri = isRemoteImage(url)
    ? {
        uri: url,
      }
    : url;
  return (
    <Animated.View style={[styles.imageContainer, animationStyles, { height }]}>
      {/* @ts-ignore */}
      <Image source={uri} style={styles.image} />
    </Animated.View>
  );
};

const Indicators: FC<
  Omit<
    SliderProps & { currentIndex: React.SetStateAction<number> },
    'item' | 'url'
  >
> = ({ index, currentIndex }) => {
  const customStyles: ViewStyle = { width: 15, opacity: 1 };
  // const animatedStyle = useAnimatedStyle(() => {
  //   const opacity = interpolate(
  //     scrollX.value,
  //     [(index - 1) * width, index * width, (index + 1) * width],
  //     [0.5, 1, 0.5],
  //     Extrapolation.CLAMP
  //   );

  //   const scale = interpolate(
  //     scrollX.value,
  //     [(index - 1) * width, index * width, (index + 1) * width],
  //     [0.8, 1.3, 0.8],
  //     Extrapolation.CLAMP
  //   );
  //   const dotWidth = interpolate(
  //     scrollX.value,
  //     [(index - 1) * width, index * width, (index + 1) * width],
  //     [10, 15, 10],
  //     Extrapolation.CLAMP
  //   );

  //   return {
  //     opacity,
  //     transform: [{ scale }],
  //     width:dotWidth,
  //   };
  // });
  return (
    <Animated.View
      key={index}
      style={[
        styles.indicator,
        currentIndex === index ? customStyles : undefined,
      ]}
    />
  );
};

const Pagination: FC<
  Omit<
    SliderProps & { currentIndex: React.SetStateAction<number> },
    'item' | 'index' | 'url'
  >
> = ({ items, scrollX, currentIndex }) => {
  return (
    <View style={styles.indicatorContainer}>
      {items?.map((_, index) => (
        <Indicators
          key={index}
          index={index}
          scrollX={scrollX}
          currentIndex={currentIndex}
        />
      ))}
    </View>
  );
};

const ImageSlider: FC<Props> = ({
  showPaginationDots = true,
  showCounter = true,
  animation = 'slide',
  height = 500,
  images,
  autoPlayInterval = 5000,
  animationDuration = 500,
  photoCounterTop = 20,
}) => {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();
  const [autoPlay, setAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);
  // Create a duplicated array for seamless infinite scroll
  const duplicatedImages = [...images, ...images];

  // / Scroll handler to update translateX
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    // onMomentumEnd: (e) => {
    //   offset.value = e.contentOffset.x;
    // },
  });

  // Auto-play effect
  useEffect(() => {
    if (autoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = withTiming(offset.value + width, {
          duration: animationDuration,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.System,
        });
        // Reset to start of original array if at the end
        if (offset.value >= images.length * width) {
          offset.value = 0; // Reset offset for seamless circular behavior
          // setCurrentIndex(0);
          ref.current?.scrollToOffset({ offset: 0, animated: false });
        }

        // Update index based on circular array
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoPlayInterval);
    } else {
      clearInterval(interval.current);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [
    animationDuration,
    autoPlay,
    autoPlayInterval,
    currentIndex,
    images.length,
    offset,
    ref,
  ]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<ImageType>[];
  }) => {
    if (
      viewableItems[0]?.index !== undefined &&
      viewableItems[0]?.index !== null
    ) {
      setCurrentIndex(viewableItems[0].index % images.length);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View style={styles.container}>
      {showCounter && (
        <Text style={[styles.count, { top: photoCounterTop }]}>
          {currentIndex + 1}/{images.length}
        </Text>
      )}

      <Animated.FlatList
        ref={ref}
        data={duplicatedImages} // Use duplicated array
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setAutoPlay(false)}
        onScrollEndDrag={() => setAutoPlay(true)}
        renderItem={({ item, index }) => (
          <SliderItem
            key={index}
            index={index}
            url={item}
            scrollX={scrollX}
            animation={animation}
            height={height}
          />
        )}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onMomentumScrollEnd={() => {
          // const offset = e.nativeEvent.contentOffset.x;
          // const currentIndex = Math.round(offset / width) % images.length;
          // setCurrentIndex(currentIndex);

          // Adjust scroll position to simulate infinite loop
          if (currentIndex === images.length - 1) {
            ref.current?.scrollToOffset({ offset: 0, animated: false });
          } else if (currentIndex === 0) {
            ref.current?.scrollToOffset({
              offset: (images.length - 1) * width,
              animated: false,
            });
          }
        }}
        onEndReachedThreshold={0.5}
      />
      {showPaginationDots && (
        <Pagination
          items={images}
          scrollX={scrollX}
          currentIndex={currentIndex}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    width,
  },
  imageContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    position: 'absolute',
    color: '#fff',
    fontWeight: 'bold',
    // top:20,
    right: 20,
    zIndex: 1000,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems:'center',
    bottom: 10,
    zIndex: 1000,
    position: 'absolute',
    left: Dimensions.get('screen').width / 2.7,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    opacity: 0.6,
  },
});

export default ImageSlider;
