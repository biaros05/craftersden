import { Link as RouterLink, LinkProps } from 'react-router-dom'
import React from 'react';

/* Router adapted from https://medium.com/@a16n.dev/wrangling-the-back-button-in-react-router-ec464e2c5dca */

const Link = (props: LinkProps) => (
  <RouterLink
    {...props}
    state={{
      ...props.state,
      canGoBack: true,
    }}
  />
)
export default Link;