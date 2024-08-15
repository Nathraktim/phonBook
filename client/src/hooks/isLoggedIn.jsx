import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function isLoggedIn(redirectTo = '/') {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if (token) {
      navigate(redirectTo);
    }
  },
  [navigate, redirectTo]);
}

export default isLoggedIn;