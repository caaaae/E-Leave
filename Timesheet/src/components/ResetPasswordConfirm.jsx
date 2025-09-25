import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../publicapi';
import Swal from 'sweetalert2';

function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      });

      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: 'Your password has been updated successfully.',
        confirmButtonColor: '#007bff',
      });

      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Set a New Password</h2>
        <p style={styles.subtitle}>
          Please enter your new password below.
        </p>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#6c757d' : '#007bff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
  },
  form: {
    background: '#fff',
    padding: '30px 25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '10px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
  },
  input: {
    width: '90%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    transition: 'background 0.3s ease',
  },
};

export default ResetPasswordConfirm;