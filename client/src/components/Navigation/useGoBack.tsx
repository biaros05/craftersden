import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from './useNavigate';

/* Router adapted from https://medium.com/@a16n.dev/wrangling-the-back-button-in-react-router-ec464e2c5dca */

const useGoBack = (fallback: string) => {
  const navigate = useNavigate();

  const location = useLocation();

  return useCallback(() => {
    console.log("Location state:", location);
    if (location.pathname === '/login') {
      console.log('going back');
      navigate(-1);
    }
    else {
      console.log('fallback');
      navigate(fallback, { replace: true });
    }
  }, [location, fallback]);
}

export default useGoBack;