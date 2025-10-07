import { type FC, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
type ImageType = string | Buffer;
type AnimationType =
  | 'slide'
  | 'fade'
  | 'scale'
  | 'rotate'
  | 'cube'
  | 'flip'
  | 'stack'
  | 'parallax';

type Props = {
  showPaginationDots?: boolean;
  showCounter?: boolean;
  animation?: AnimationType;
  height?: number;
  images: ImageType[];
  autoPlayInterval?: number;
  animationDuration?: number; // Duration for scroll animation in milliseconds
  photoCounterTop?: number;
};

type SliderProps = {
  url: ImageType;
  index: number;
  scrollX: SharedValue<number>;
  animation?: AnimationType;
  items?: ImageType[];
  height?: number;
};

const isRemoteImage = (image: string | Buffer): boolean => {
  const imagePath = typeof image === 'string' ? image : image?.toString();
  return imagePath.startsWith('http://') || imagePath.startsWith('https://');
};

const SliderItem: FC<SliderProps> = ({
  url,
  scrollX,
  index,
  animation = 'slide',
  height,
}) => {
  // Slide animation - default smooth slide with subtle scale
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

  // Fade animation - simple opacity transition
  const fadeStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  // Scale animation - zoom in/out effect
  const scaleStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Rotate animation - 3D rotation effect
  const rotateStyles = useAnimatedStyle(() => {
    const rotateY = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [45, 0, -45],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // Cube animation - 3D cube rotation effect
  const cubeStyles = useAnimatedStyle(() => {
    const rotateY = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [90, 0, -90],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-width / 2, 0, width / 2],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { perspective: 1200 },
        { translateX },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  // Flip animation - card flip effect
  const flipStyles = useAnimatedStyle(() => {
    const rotateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [60, 0, -60],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1000 }, { rotateX: `${rotateX}deg` }],
      opacity,
    };
  });

  // Stack animation - cards stacking effect
  const stackStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.85, 1, 0.85],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [100, 0, 100],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  // Parallax animation - depth effect
  const parallaxStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-width * 0.5, 0, width * 0.5],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [1.2, 1, 1.2],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  // Select animation style based on prop
  const getAnimationStyle = () => {
    switch (animation) {
      case 'fade':
        return fadeStyles;
      case 'scale':
        return scaleStyles;
      case 'rotate':
        return rotateStyles;
      case 'cube':
        return cubeStyles;
      case 'flip':
        return flipStyles;
      case 'stack':
        return stackStyles;
      case 'parallax':
        return parallaxStyles;
      case 'slide':
      default:
        return slideStyles;
    }
  };

  const animationStyles = getAnimationStyle();
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
  Omit<SliderProps & { currentIndex: number }, 'item' | 'url'>
> = ({ index, currentIndex }) => {
  const customStyles: ViewStyle = { width: 15, opacity: 1 };

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
  Omit<SliderProps & { currentIndex: number }, 'item' | 'index' | 'url'>
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
  animationDuration = 400, // Default 400ms for smooth transitions
  photoCounterTop = 20,
}) => {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  // Update current index from scroll position
  const updateIndex = (offsetX: number) => {
    const index = Math.round(offsetX / width);
    setCurrentIndex(index % images.length);
  };

  // Animated scroll handler for smoother updates
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateIndex)(event.contentOffset.x);
    },
  });

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlay && images.length > 1) {
      //@ts-ignore
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * width,
            animated: true,
          });
          return nextIndex;
        });
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, autoPlayInterval, images.length]);

  return (
    <View style={styles.container}>
      {showCounter && (
        <Text style={[styles.count, { top: photoCounterTop }]}>
          {currentIndex + 1}/{images.length}
        </Text>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onScrollEndDrag={() => {
          setIsAutoPlay(true);
        }}
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
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        // Apply custom animation duration for scrolling
        decelerationRate={animationDuration < 300 ? 'fast' : 'normal'}
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
