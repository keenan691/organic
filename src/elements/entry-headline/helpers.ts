export const getHeadlineIconName = (item) => {
  let headlineIconName;
  switch (item.content ? item.content.split('\n').length : 0) {
    case 0:
    case 1:
      return (headlineIconName = 'ios-radio-button-off');
    case 2:
    case 3:
      return (headlineIconName = 'ios-disc-outline');
    default:
      return (headlineIconName = 'ios-disc');
  }
};
