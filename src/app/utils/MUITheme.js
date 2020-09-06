import {unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

import * as variables from '../../style/variables.scss';

export const MUITheme = createMuiTheme({
    palette: {
      primary: {
        main: variables.primary,

      },
      secondary: {
        main: variables.secondary,
      },

    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  });