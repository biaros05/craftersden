import { useCallback } from 'react';
import useNavigate from './useNavigate';

const useGoBack = (fallback: string, location: any) => {
  const navigate = useNavigate();

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