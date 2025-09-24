import React, { useState } from 'react';
import api from '../api'; 
import Swal from 'sweetalert2';
import classes from '../assets/Loginform/loginform.module.css';
import loginImage from '../assets/Loginform/loginimage.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This endpoint should be configured on your Django backend (e.g., using djoser)
      await api.post('/api/auth/users/reset_password/', { email }); 
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'If your email is in our system, you will receive a password reset link shortly.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue processing your request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit} className={classes['form-container']}>
        <img src={loginImage} alt={"loginImage"}/>
        <h1>Forgot Password</h1>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        <div className={classes['input-box']}>
          <input
            className={classes['form-input']}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className={classes['login-button']}>
          <button className={classes['form-button']} type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;