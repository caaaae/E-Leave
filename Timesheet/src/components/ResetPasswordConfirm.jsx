import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
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
      console.log("uid ----> ", uid)
      console.log("token ----> ", token)
      console.log("password ----> ", newPassword)

      await api.post('/api/auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your password has been reset successfully.',
      });
      navigate('/login');
    } catch (error) {
      // ... handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default ResetPasswordConfirm;