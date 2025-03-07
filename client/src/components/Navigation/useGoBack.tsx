import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from './useNavigate';

const useGoBack = (fallback: string) => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    console.log("Location state:", location.state);
    if (location.state.canGoBack) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }, [location, fallback]);
}

export default useGoBack;