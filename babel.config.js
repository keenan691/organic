module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src/'],
        extensions: ['.tsx', '.ts'],
        alias: {
          '@components': './src/elements/components',
          '@core': './src/core',
          '@modules': './src/modules',
        },
      },
    ],
    [
      '@babel/plugin-transform-modules-commonjs',
      {
        strictMode: false,
        allowTopLevelThis: true,
        loose: true,
      },
    ],
  ],
}
