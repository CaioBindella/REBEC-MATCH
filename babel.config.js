module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // O plugin do Reanimated TEM que ser o último da lista
      'react-native-reanimated/plugin',
    ],
  };
};
