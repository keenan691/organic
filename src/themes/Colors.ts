import { shadeBlend } from '../utils/functions';

// * Colors Repository

const flatUiColors = {
  primary: shadeBlend(0.1, '#E74C3C'),
  secondary: '#2C3E50',
  white: '#ECF0F1',
  complement1: '#3498DB',
  complement2: '#2980B9',
};

const newColors = {
  primary: flatUiColors.primary,
  // primary: "#cb4b16",
  complementRed: '#dc322f',
  // primary: "#d33682",
  secondary: '#2f4f4f',
  cyan: '#ECF0F1',
  white: '#ECF0F1',
  // complement1: "#2f4f4f",
  complement1: '#3498DB',
  complement2: '#2980B9',
  // menuButton: "#2f4f4f",
  // menuButton: shadeBlend(0.4, "#2f4f4f"),
  menuButton: shadeBlend(0.4, '#2f4f4f'),
  menuButton1: shadeBlend(0.2, '#2f4f4f'),
  menuButtonSelected: flatUiColors.primary,
};

// * Palette

const palette = {
  light: shadeBlend(-0.3, newColors.white),
};

// * Old Colors

const colors = {
  ...newColors,
  transparent: 'rgba(0,0,0,0)',
  light: '#b58900',
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  ebase00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  special: '#d33682',

  magenta: '#E74C3C',
  // cyan: newColors,

  // cyan: '#2f4f4f',

  blue: '#268bd2',
  violet: '#6c71c4',
  afterblue: '#2e8b57',

  // green:     '#859900',
  green: '#32cd32',
  separator: '#Dcdcdc',
  button: '#bebebe',
  bg: '#ECF0F1',

  // Dark theme
  // separator:    '#002b36',
  // bg:    '#002b36',
  // button: '#073642',

  // Black and White
  white: 'white',
  black: 'black',
};

// * Headers

export const orgHeadersColors = [
  colors.magenta,
  colors.afterblue,
  colors.blue,
  colors.violet,
];

// * Theme

const whiteTheme = {
  headlineText: orgHeadersColors,
  fileText: shadeBlend(0.3, colors.secondary),
  statusBarColor: shadeBlend(0.3, colors.secondary),
  // editMenuColor: shadeBlend(0.8, colors.secondary),
  editMenuColor: colors.bg,
  warning: colors.primary,
  error: colors.primary,
  tabBarBg: shadeBlend(0, colors.bg),
  // tabBarText: shadeBlend(-0.3, colors.complement2),
  tabBarText: shadeBlend(0.2, colors.secondary),
  label: colors.base2,
  status: colors.secondary,
  // pastel: shadeBlend(0.3, colors.green),
  pastel: colors.complement2,
  lightGray: shadeBlend(0.8, colors.secondary),
  ...colors,

  // bg: colors.secondary,
  green: shadeBlend(0.2, colors.green),
  red: shadeBlend(0, colors.primary),
};

export default whiteTheme;
