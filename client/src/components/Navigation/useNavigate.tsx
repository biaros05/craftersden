import { NavigateOptions, To, useNavigate as useRouterNavigate } from 'react-router-dom';

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