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
 *
 */
export default function LoadingPage() {
  return (
    <MantineThemeProvider theme={theme}>
      <Loader />
    </MantineThemeProvider>
  );
}