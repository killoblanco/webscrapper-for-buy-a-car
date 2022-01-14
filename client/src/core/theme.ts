import { createTheme, responsiveFontSizes } from '@mui/material';
import { teal } from '@mui/material/colors';

const appTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: teal,
  },
}))

export default appTheme;
