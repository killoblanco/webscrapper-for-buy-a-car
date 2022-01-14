import { ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import Landing from '../landing';
import appTheme from './theme';

function App() {
  return (
    <StrictMode>
      <ThemeProvider theme={appTheme}>
        <Landing />
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;
