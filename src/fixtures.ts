import R from 'ramda';

import { emptyCaptureTemplate } from './redux/CaptureRedux';

const captureTemplateNames = [];

const createCaptureTemplateData = (num) =>
  R.merge(emptyCaptureTemplate, { name: captureTemplateNames[num] });

export const captureTemplateFixtures = R.range(
  0,
  captureTemplateNames.length,
).map((num) => createCaptureTemplateData(num));
