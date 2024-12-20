import ImageSlider from 'react-native-photo-slider';

const images = [
  'https://firebasestorage.googleapis.com/v0/b/connect-app-1f5ca.appspot.com/o/turns%2F1732164403634?alt=media&token=c59afebc-1ab9-4779-b8cd-9c52a5d2474b',
  'https://firebasestorage.googleapis.com/v0/b/connect-app-1f5ca.appspot.com/o/turns%2F1732224936078?alt=media&token=15e7c702-5b41-4723-91d2-99e736e173ff',
  'https://firebasestorage.googleapis.com/v0/b/connect-app-1f5ca.appspot.com/o/turns%2F1731575841466?alt=media&token=a6233b86-11bc-4b6a-8715-a1eac7424df7',
];
export default function App() {
  return <ImageSlider images={images} />;
}
