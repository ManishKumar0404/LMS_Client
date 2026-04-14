import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayouts'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { login } from '../Redux/Slices/AuthSlice'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  }

  async function OnLogin(event) {
    event.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    const response = await dispatch(login(loginData));
    if (response?.payload?.success) {
      navigate("/");
    }

    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className='flex items-center justify-center h-[100vh]'>
        <form noValidate onSubmit={OnLogin} className='flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px]'>
          <h1 className='text-center text-2xl font-bold'>Login Page</h1>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              type="email"
              required
              name='email'
              id='email'
              placeholder='Enter your email..'
              className='bg-transparent px-2 py-1 border rounded-sm'
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                name='password'
                id='password'
                placeholder='Enter your password..'
                className='w-full bg-transparent px-2 py-1 border rounded-sm'
                onChange={handleUserInput}
                value={loginData.password}
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className='mt-1 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg'>
            Login
          </button>

          <p className='text-center'>
            Do not have an account? <Link to="/Signup" className="link text-accent cursor-pointer">Signup</Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
