import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
//hooks
import isLoggedIn from '../hooks/isLoggedIn';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  isLoggedIn('/');

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    let extractedMessage = '';
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json();

      if (!data.username) {
        extractedMessage = data.message.replace(/"/g, '').replace(/^\w/, c => c.toUpperCase()) + '.';
        setError(extractedMessage);
      } else {
      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('token', data.token);
      navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className='bg-zinc-900 text-white p-10 shadow-md h-screen'>
      <div className='flex flex-row justify-between object-center center center my-5 align-middle justify-items-center snap-'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold'>Phone Book</h2>
          <p className='text-gray-300 text-sm'></p>
        </div>
      </div>
      <div className='flex-col items-center flex '>
      <form onSubmit={handleSubmit} className='bg-zinc-900 text-white p-10 sm:p-1 mx-10 md:w-[550px] sd:w-[100px]'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <div className='mb-4'>
        <label htmlFor='username' className='block text-sm font-medium mb-2'>
          Username
        </label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='password' className='block text-sm font-medium mb-2'>
          Password
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>
      {error && <div className='text-red-500 text-sm font-light'>{error}</div>}
      <div className='flex items-center justify-between'>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-blue-700 hover:bg-blue-500 text-white font-normal hover:font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </div>
      <div className='flex flex-col justify-center items-center text-center mt-4 gap-2'>
          <p className='text-gray-300 text-sm'>Don't have an account?</p>
          <button
           className='text-white text-sm hover:text-blue-500 hover:font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline bg-zinc-800 hover:bg-zinc-700'
           type='button'
           onClick={() => navigate('/register')}
          >
            Signup
          </button>
          </div>
    </form>
      </div>
    </div>
  );
}

export default Login;
