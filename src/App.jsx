import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from "./Components/HomePage";
import SuccessfulPage from "./Components/SuccessfulPage";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Create caches for both directions
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

// App content wrapper that uses language context
function AppContent() {
  const { direction, isHebrew } = useLanguage();
  
  // Create theme based on current direction
  const theme = createTheme({
    direction: direction,
    typography: {
      fontFamily: direction === 'rtl' ? 'Rubik, sans-serif' : 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
    },
  });

  // Choose appropriate cache based on language
  const cache = isHebrew ? cacheRtl : cacheLtr;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {console.log(isHebrew)}
            <Route path="/device/:encode" element={<HomePage />} />
            <Route path="/successful" element={<SuccessfulPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
