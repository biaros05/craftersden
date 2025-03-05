import { forwardRef } from 'react';
import cx from 'clsx';
import { Box, MantineLoaderComponent } from '@mantine/core';
import classes from './CssLoader.module.css';
import React from 'react';

export const CssLoader: MantineLoaderComponent = forwardRef(({ className, ...others }, ref) => 
  <Box component="span" className={cx(classes.loader, className)} {...others} ref={ref} />
);