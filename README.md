![Build Status](https://github.com/herberthk/react-native-photo-slider/actions/workflows/ci.yml/badge.svg)[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)![Supports Android](https://img.shields.io/badge/Supports-Android-green.svg)![Supports iOS](https://img.shields.io/badge/Supports-iOS-blue.svg)![npm version](https://img.shields.io/npm/v/@herberthtk/react-native-photo-slider.svg)![npm](https://img.shields.io/npm/dw/@herberthtk/react-native-photo-slider)

# React Native Photo Slider

A modern, animated, and highly customizable image slider component for React Native.

## Features

*   **Multiple Animations:** Choose from a variety of slide animations like `slide`, `fade`, `scale`, `rotate`, `cube`, `flip`, `stack`, and `parallax`.
*   **Autoplay:** Automatically cycle through images with a customizable interval.
*   **Pagination:** Display pagination dots to indicate the current slide.
*   **Image Counter:** Show a counter to display the current image number.
*   **Customizable:** Adjust the height, animation duration, and more.
*   **Lightweight:** Built with performance in mind.

## Installation

```sh
npm install @herberthtk/react-native-photo-slider
```

## Usage

```javascript
import ImageSlider from '@herberthtk/react-native-photo-slider';

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
];

export default function App() {
  return <ImageSlider images={images} />;
}
```

### With Options

```javascript
import ImageSlider from '@herberthtk/react-native-photo-slider';

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
];

export default function App() {
  return (
    <ImageSlider
      images={images}
      height={400}
      animation="cube"
      autoPlayInterval={5000}
      animationDuration={400}
      showPaginationDots={true}
      showCounter={true}
    />
  );
}
```

## Props

| Prop                | Type                                      | Default   | Description                                                                 |
| ------------------- | ----------------------------------------- | --------- | --------------------------------------------------------------------------- |
| `images`            | `string[]` or `Buffer[]`                  | `[]`      | An array of image URLs or local image buffers.                                |
| `height`            | `number`                                  | `500`     | The height of the slider component.                                         |
| `animation`         | `AnimationType`                           | `'slide'` | The type of animation to use for transitions. See [Animations](#animations). |
| `autoPlayInterval`  | `number`                                  | `5000`    | The interval in milliseconds for autoplay.                                  |
| `animationDuration` | `number`                                  | `400`     | The duration in milliseconds for the scroll animation.                      |
| `showPaginationDots`| `boolean`                                 | `true`    | Whether to show pagination dots.                                            |
| `showCounter`       | `boolean`                                 | `true`    | Whether to show the image counter.                                          |
| `photoCounterTop`   | `number`                                  | `20`      | The top position of the photo counter.                                      |

## Animations

The `animation` prop accepts the following values:

*   `slide` (default)
*   `fade`
*   `scale`
*   `rotate`
*   `cube`
*   `flip`
*   `stack`
*   `parallax`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ by [Herbert Kavuma](https://herbert.netbritz.com/)