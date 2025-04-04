import { NavigateOptions, To, useNavigate as useRouterNavigate } from 'react-router-dom';

/* Router adapted from https://medium.com/@a16n.dev/wrangling-the-back-button-in-react-router-ec464e2c5dca */

const useNavigate = () => {
  const navigate = useRouterNavigate();
  return (to: To, opts?: NavigateOptions) =>
    navigate(to, {
      ...opts,
      state: {
        ...opts?.state,
        canGoBack: true,
      },
    });
};
export default useNavigate;