const loadIcons = (IconPack, icons) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      Object.keys(icons).map((iconName) => {
        const icon = icons[iconName];
        return IconPack.getImageSource(iconName, icon.size);
      }),
    ).then(
      (sources) => resolve(sources),
      (error) => reject(new Error('Could not load icons')),
    );
  });
};

export default loadIcons;
