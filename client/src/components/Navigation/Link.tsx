import { Link as RouterLink, LinkProps } from 'react-router-dom'
import React from 'react';

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