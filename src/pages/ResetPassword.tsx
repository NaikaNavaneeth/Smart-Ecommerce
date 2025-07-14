import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated! Please log in.');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h2 className="text-2xl font-semibold mb-4">Set a new password</h2>
      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
