import { MantineThemeProvider, Loader, createTheme } from '@mantine/core';
import { CssLoader } from './CssLoader';
import React from 'react';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader },
        type: 'custom',
      },
    }),
  },
});

/**
 * Loading page component that renders a loader
 * @returns {React.ReactNode} Loader
 */
export default function LoadingPage(): React.ReactNode {
  return (
    <MantineThemeProvider theme={theme}>
      <Loader />
    </MantineThemeProvider>
  );
}