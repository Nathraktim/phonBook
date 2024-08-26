import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
//hooks
import isLoggedIn from '../hooks/isLoggedIn';

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  const signupURL = import.meta.env.VITE_REGISTER_PATH;
  const navigate = useNavigate()
  isLoggedIn('/');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(signupURL, {
        username,
        password
      })
      localStorage.setItem('userId', response.data.id)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <div className='bg-zinc-900 text-white p-10 shadow-md h-screen'>
      <div className='flex flex-row justify-between object-center center center my-5 align-middle justify-items-center snap-'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold'>Phone Book</h2>
          <p className='text-gray-300 text-sm'></p>
        </div>
      </div>
      <div className='flex-col items-center flex '>
      <form onSubmit={handleSubmit} className='bg-zinc-900 text-white px-10 mx-10 lg:w-[550px] md:w-[550px] sd:w-[100px]'>
      <h2 className='text-2xl font-bold mb-4'>Signup</h2>
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
      <div className='flex flex-col gap-2 w-full'>
      {error && <div className='text-red-500 text-sm text-center'>{error}</div>}
        <button
          type='submit'
          className='bg-blue-700 hover:bg-blue-500 w-fit text-white font-normal hover:font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Signup
        </button>
      </div>
      <div className='flex flex-col justify-center items-center text-center mt-4 gap-2'>
          <p className='text-gray-300 text-sm'>Already have an account?</p>
          <button
           className='text-white text-sm hover:text-blue-500 hover:font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline bg-zinc-800 hover:bg-zinc-700'
           type='button'
           onClick={() => navigate('/Login')}
          >
            Login
          </button>
          </div>
    </form>
      </div>
    </div>
    // <div className='flex justify-center items-center h-screen bg-zinc-900'>
    //   <form onSubmit={handleSubmit} className='bg-zinc-900 text-white p-10 mx-10 md:w-[550px] sd:w-[100px]'>
    //     <div className='mb-4'>
    //       <label className='block text-gray-300 text-sm font-bold mb-2' htmlFor='username'>
    //         Username
    //       </label>
    //       <input
    //         className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
    //         id='username'
    //         type='text'
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //       />
    //     </div>
    //     <div className='mb-6'>
    //       <label className='block text-gray-300 text-sm font-bold mb-2' htmlFor='password'>
    //         Password
    //       </label>
    //       <input
    //         className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
    //         id='password'
    //         type='password'
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>
    //     <div className='flex items-center justify-between'>
    //       <button
    //         className='bg-blue-700 text-sm hover:bg-blue-500 text-white font-normal focus:font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
    //         type='submit'
    //       >
    //         Sign Up
    //       </button>
    //     </div>
    //     <div className='flex flex-col justify-center items-center text-center mt-4 gap-2'>
    //       <p className='text-gray-300 text-sm'>Already have an account?</p>
    //       <button
    //        className='text-white text-sm hover:text-blue-500 hover:font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline bg-zinc-800 hover:bg-zinc-700'
    //        type='button'
    //        onClick={() => navigate('/login')}
    //       >
    //         Login
    //       </button>
    //       </div>
    //   </form>
    // </div>
  )
}

export default Signup
