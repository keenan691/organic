import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({ /* configuration options */
  config: ({ configure }) =>
    configure(() => {
      require('../storybook/stories/index.tsx');
    }, module),
});
