import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GithubSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // optionally: fetch /me to update context
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, location]);

  return <p>Redirecting...</p>;
}

export default GithubSuccess;
