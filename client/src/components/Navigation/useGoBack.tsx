import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from './useNavigate';

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