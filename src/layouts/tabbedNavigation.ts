import {Navigation, LayoutRoot} from 'react-native-navigation';
import Theme from 'themes';
import Icon from 'react-native-vector-icons/FontAwesome';

Navigation.setDefaultOptions({
  animations: {
    setRoot: {
      enabled: 'true',
      alpha: {
        from: 0,
        to: 1,
        duration: 400,
        startDelay: 100,
        interpolation: 'accelerate',
      },
    },
  },
});

const createBottomTab = async (text, iconName) => ({
  text,
  icon: await Icon.getImageSource(iconName, 50, Theme.colors.disabled),
  iconSelected: await Icon.getImageSource(iconName, 50, Theme.colors.accent),
});

const createTopBar = () => ({
  visible: false,
  drawBehind: true,
  animate: true,
});

export const tabbedNavigation = async () => {
  Navigation.setRoot(<LayoutRoot>{
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              children: [{component: {name: 'Search'}}],
              options: {
                topBar: createTopBar(),
                bottomTab: await createBottomTab('Search', 'search'),
              },
            },
          },
          {
            stack: {
              children: [{component: {name: 'Main'}}],
              options: {
                topBar: createTopBar(),
                bottomTab: await createBottomTab('Editor', 'rocket'),
              },
            },
          },
          {
            stack: {
              children: [{component: {name: 'Other'}}],
              options: {
                topBar: createTopBar(),
                bottomTab: await createBottomTab('Timeline', 'rocket'),
              },
            },
          },
          {
            stack: {
              children: [{component: {name: 'Other'}}],
              options: {
                topBar: createTopBar(),
                bottomTab: await createBottomTab('Note', 'rocket'),
              },
            },
          },
        ],
      },
    },
  });
  Navigation.mergeOptions('BottomTabsId', {
    bottomTabs: {
      currentTabIndex: 1,
    },
  });
};

export default tabbedNavigation;
