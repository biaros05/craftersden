import { Navigate as RouterNavigate, NavigateProps } from 'react-router-dom'
import React from 'react';

/* Router adapted from https://medium.com/@a16n.dev/wrangling-the-back-button-in-react-router-ec464e2c5dca */

const Navigate = (props: NavigateProps) => (
<RouterNavigate
  {...props}
  state={{
    ...props.state,
    canGoBack: true,
  }}
/>
)
export default Navigate;