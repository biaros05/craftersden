import { Navigate as RouterNavigate, NavigateProps } from 'react-router-dom'
import React from 'react';

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