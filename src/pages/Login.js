import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnvDebug from '../components/EnvDebug';
import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Add this for GitHub icon

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setCurrentUser } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin(token) {
    fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Google login response:', data);

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Update context if possible
          if (setCurrentUser) setCurrentUser(data.user);

          console.log('Navigating to', from);
          navigate('/dashboard'); // or use window.location.href = from;
        } else {
          setError(data.message || 'Google Sign-In failed');
        }
      })
      .catch(err => {
        console.error('Google login error:', err);
        setError('Google Sign-In failed');
      });
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h2 className="fs-3 fw-semibold text-center mb-4">Sign In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                  </div>
                </Form>
                <div className="text-center mb-2">or</div>
                <GoogleLogin
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signin_with"
                  locale="en"
                  onSuccess={credentialResponse => handleGoogleLogin(credentialResponse.credential)}
                  onError={() => setError('Google Sign-In was unsuccessful.')}
                />
                <Button 
                  variant="dark" 
                  className="w-100 mb-2" 
                  href="http://localhost:5000/api/auth/github"
                >
                  <i className="bi bi-github me-2"></i>
                  Sign in with GitHub
                </Button>
              </Card.Body>
              <Card.Footer className="bg-white text-center border-0 p-3">
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="text-decoration-none small">Sign Up</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
      <EnvDebug />
    </div>
  );
}

export default Login;