import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import setStatus from '../utils/setStatus';

const Login = () => {
  const [student_email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useContext(AuthContext);

  // Prevents user from going back to the login page withoiut logging off
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  // LOGIN FUNCTION 
  const handleSubmit = async (event) => {
    event.preventDefault();

    // always check for ip changes
    try {
      const response = await axios.post('http://192.168.1.5:5555/login', {
        student_email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user;
        login(response.data.token, userData);
        setSuccess('Login successful!');
        setError('');
        
        // set status to online
        await setStatus(userData, 'Online');

        navigate('/home', { replace: true });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Incorrect email or password.');
        } else {
          setError(error.response.data);
        }
        setSuccess('');
      } else {
        setError('An error occurred');
        setSuccess('');
      }
    }
  };

  return (
    <main className='font-prompt h-screen w-screen flex justify-center items-center bg-customWhite'>
      <form id='loginform' onSubmit={handleSubmit} className='flex justify-center items-center flex-col w-full h-full max-h-[450px] md:max-h-[570px] md:max-w-[750px] space-y-5 m-5 md:space-y-8 px-10 md:px-5 border-4 rounded-xl border-customGray'>
        
        {/* LOGO */}
        <section className='flex flex-col items-center justify-center'>
          <div>
            <p className='text-xl md:text-3xl font-medium md:font-bold transition-all'>Welcome to</p>
            <p className='text-customGreen font-extrabold font-inter text-[100px] md:text-[180px] leading-[1] transition-all'>iCARE</p>
          </div>
          <p className='text-center text-lg md:text-xl font-semibold'>iTamaraw Center for Academic Resources and Enrichment</p>
        </section>

        {/* INPUT SECTIONS */}
        <section className='flex flex-col space-y-3 w-full max-w-[300px] md:max-w-[500px] text-base'>

            {/* EMAIL INPUT */}
          <div>
            <input required autoFocus id='email' autoComplete='email'
              type='text' 
              placeholder='FIT Email' 
              value={student_email}
              onChange={(e) => setEmail(e.target.value)}
              className={`focus:outline-none pl-5 focus:ring-4 focus:ring-customGray bg-white2 rounded-lg md:rounded-xl h-8 md:h-10 w-full ${error && !student_email ? 'border-red-500' : ''}`}
            />
          </div>
          
            {/* PASSWORD INPUT */}
          <div>
            <input required id='password' autoComplete='current-password'
              type='password' 
              placeholder='Password' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`focus:outline-none pl-5 focus:ring-4 focus:ring-customGray bg-white2 rounded-lg md:rounded-xl h-8 md:h-10 w-full ${error && !password ? 'border-red-500' : ''}`}
            />
          </div>
        </section>

        {/* LOGIN STATUS MESSAGE */}
        <section>
          {/* ERROR TEXT */}
          {error && <p className='text-red-500'>{error}</p>}
          {/* SUCCESS TEXT */}
          {success && <p className='text-green-500'>{success}</p>}
        </section>

        {/* LOGIN BUTTON */}
        <section className='max-w-40 max-h-10 w-full h-full'>
          <button 
            type='submit'
            className='focus:outline-none bg-customGreen hover:bg-green2 focus:ring-4 focus:ring-green2 transition-all text-customWhite font-bold text-2xl rounded-lg w-full h-full'
          >
            Login
          </button>
        </section>

      </form>
    </main>
  );
};

export default Login;
