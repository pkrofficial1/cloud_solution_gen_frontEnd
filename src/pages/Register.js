import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Add this for GitHub icon

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account');
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
  
          console.log('Navigating to /dashboard');
          navigate('/dashboard'); 
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
                <h2 className="fs-3 fw-semibold text-center mb-4">Create Account</h2>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
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
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-decoration-none small">Sign In</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Register;